const logger = require('../utils/logger.utils');

function errorMiddleware(error, req, res, next) {
    let { status = 500, message, data } = error;

    logger.info(`[Error] ${message}`);

    // If status code is 500 - change the message to Intrnal server error
    message = status === 500 || !message ? 'Internal server error' : message;

    error = {
        status,
        message,
        data
    }

    res.status(parseInt(status)).send(error);
}

module.exports = errorMiddleware;
/*
{
    type: 'error',
    status: 404,
    message: 'Not Found'
    data: {...} // optional
}
*/