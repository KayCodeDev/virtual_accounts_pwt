const winston = require('winston');
const { combine, timestamp, json, printf } = winston.format;
const DailyRotateFile = require('winston-daily-rotate-file');
const { inspect } = require('util');

const logFormat = printf(({ level, message, timestamp }) => {
    if (typeof message === 'object') {
        message = inspect(message, { depth: Infinity, colors: true });
    }
    return `${timestamp} [${level}]: ${message}`;
});


var logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        json(),
        logFormat
    ),
    transports: [
        new DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d'
        })
    ]
});

module.exports = logger;