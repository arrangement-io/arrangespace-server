const { createLogger, format, transports } = require('winston');
var expressWinston = require('express-winston');
const { LOG_LEVEL } = process.env;

// Logger to capture all requests and output them to the console.
const requestLogger = expressWinston.logger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
      )
    })
  ],
  meta: true
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new transports.Console({
      json: true
    })
  ]
});

const logger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json(),
    format.colorize()
  ),
  transports: [new transports.Console()]
});

module.exports = {
  requestLogger: requestLogger,
  errorLogger: errorLogger,
  logger: logger
};
