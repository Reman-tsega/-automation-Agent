import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../utils/logger';

export class ErrorMiddleware {
  constructor(private logger: LoggerService) {}

  handle(err: Error, req: Request, res: Response, next: NextFunction): void {
    this.logger.error('Unhandled error', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}