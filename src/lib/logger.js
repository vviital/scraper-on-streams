const winston = require('winston');
const fs = require('fs');

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const time = new Date().toLocaleString().replace(/\//g, '-');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: () => new Date().toLocaleString(),
      colorize: true,
      level: 'info',
    }),
    new (winston.transports.File)({
      name: 'error-file',
      level: 'error',
      filename: `logs/error-${time}.log`,
    }),
    new (winston.transports.File)({
      name: 'info-file',
      level: 'info',
      filename: `logs/info-${time}.log`,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: `logs/exceptions-${time}.log`,
      humanReadableUnhandledException: true,
    }),
  ],
});

module.exports = logger;
