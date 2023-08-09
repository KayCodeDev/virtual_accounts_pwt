const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const apiRouter = require('./routes/api.route');
const sequelize = require("./models/sequelize.config");

// Init express
const app = express();
// Init environment
dotenv.config();
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());

const port = Number(process.env.PORT || 3331);

app.use(`/api/v1`, apiRouter);

app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Not Found');
    next(err);
});

app.use(errorMiddleware);

//Init Serialize ORM and start server
sequelize.sync({ alter: true })
    .then(() => {
        console.log("Synced db.");
        app.listen(port, () =>
            console.log(`🚀 Server running on port ${port}!`));
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

module.exports = app;