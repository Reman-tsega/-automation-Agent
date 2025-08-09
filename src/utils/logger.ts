import winston from 'winston';
import { ConfigService } from '../config/config';
import { v4 as uuidv4 } from 'uuid';

export class LoggerService {
  private logger: winston.Logger;

  constructor(config: ConfigService) {
    this.logger = winston.createLogger({
      level: config.getConfig().logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.metadata({
          fillExcept: ['message', 'level', 'timestamp'],
        }),
        winston.format((info) => {
          info.requestId = info.requestId || uuidv4();
          return info;
        })()
      ),
      transports: [
        new winston.transports.Console(),
      ],
    });
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }
}