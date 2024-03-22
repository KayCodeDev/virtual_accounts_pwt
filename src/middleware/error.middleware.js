const logger = require('../utils/logger.utils');

function errorMiddleware(error, req, res, next) {
    console.error(error);

    let { status = 500, message, data } = error;

    logger.info(`[Error] ${message}`);
    logger.info(req.body);
    logger.info(req.url);
    logger.info(req.ip);
    logger.info(req.headers);
    logger.info(req.hostname);

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