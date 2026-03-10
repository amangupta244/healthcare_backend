import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'healthcare-api' },
  transports: [
    new transports.Console({ format: format.simple() })
    // could add file transport in production
  ]
});

export default logger;