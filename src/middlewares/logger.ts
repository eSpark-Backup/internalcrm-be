import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLoggingMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body, query } = req;
    this.logger.log(
      `Incoming request: ${method} ${url} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)}`,
    );
    next();
  }
}
