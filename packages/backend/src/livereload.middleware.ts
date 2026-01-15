import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LiveReloadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'development' && req.path === '/') {
      const originalSend = res.send.bind(res);
      res.send = function(data: any) {
        if (typeof data === 'string' && data.includes('</body>')) {
          data = data.replace(
            '</body>',
            `<script async src="http://localhost:35729/livereload.js"></script></body>`
          );
        }
        return originalSend(data);
      };
    }
    next();
  }
}
