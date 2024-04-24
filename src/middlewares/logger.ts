import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLoggingMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV != 'production') {
      const { method, baseUrl, body, query, params, route } = req;
      this.logger.log(
        `Incoming request: ${method} ${baseUrl} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)} - Params: ${JSON.stringify(query)}`,
      );
    }
    next();
  }
}
