import type { Logger as WLoger } from 'winston'
import { createLogger, format, transports } from 'winston'
import { DataMap } from 'phecda-server'

export class Logger {
  logger: WLoger
  constructor() {
    this.logger = createLogger(DataMap['megrez:logger-opts'] || {
      level: 'info',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple(),
          ),
        }),
      ],

    })
  }

  info(msg: string) {
    return this.logger.info(msg)
  }

  error(msg: string) {
    return this.logger.error(msg)
  }

  warn(msg: string) {
    return this.logger.warn(msg)
  }

  debug(msg: string) {
    return this.logger.debug(msg)
  }

  verbose(msg: string) {
    return this.logger.verbose(msg)
  }
}
