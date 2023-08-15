const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const apiRouter = require('./routes/api.route');
const adminRoute = require('./routes/admin.route');
const sequelize = require("./models/sequelize.config");
const socketServer = require("./socket.server");

// Init express
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.options("*", cors());

const port = Number(process.env.PORT || 3300);

app.use(`/api/v1/admin`, adminRoute);
app.use(`/api/v1`, apiRouter);

app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Not Found');
    next(err);
});

app.use(errorMiddleware);

//Init Serialize ORM and start server
sequelize.sync({ force: process.env.FORCE_DB == "true", alter: process.env.ALTER_DB == "true" })
    .then(() => {
        console.log("Synced db.");
        app.listen(port, () => {
            console.log(`🚀 API Server running on port ${port}`);
            socketServer.startServer();
        });
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

module.exports = app;