import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.colorize({ all: true }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/app.log' }),
  ],
})

if (process.env.NODE_ENV === 'test') {
  logger.transports[0].silent = true
}
export default logger
