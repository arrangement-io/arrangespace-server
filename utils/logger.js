const winston = require('winston');
const expressWinston = require('express-winston');
const { createLogger, format, transports } = winston;
const Papertrail = require('winston-papertrail').Papertrail;
const { LOG_LEVEL, NODE_ENV } = process.env;

let transport = null;

// If we are in production environment, send logs to Papertrail
if (NODE_ENV === 'prod') {
  transport = new Papertrail({
    host: 'logs.papertrailapp.com',
    port: 53142
  });
} else {
  transport = new winston.transports.Console();
}

// Logger to capture all requests and output them to the console.
const requestLogger = expressWinston.logger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.json()
      )
    })
  ],
  meta: true
});

const errorLogger = expressWinston.errorLogger({
  transports: [transport]
});

const logger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.json(),
    format.colorize()
  ),
  transports: [transport]
});

module.exports = {
  requestLogger: requestLogger,
  errorLogger: errorLogger,
  logger: logger
};
