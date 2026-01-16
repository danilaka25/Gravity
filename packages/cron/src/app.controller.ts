import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }

  @Get()
  getHome(@Res() res: Response) {
    // In development, Vite handles the React app
    // In production, serve the built frontend
    const isDev = process.env.NODE_ENV !== 'production';
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Gravity - Monobank Jars</title>
          ${isDev ? '<script type="module" src="http://localhost:5173/@vite/client"></script>' : ''}
        </head>
        <body>
          <div id="root"></div>
          ${isDev ? '<script type="module" src="http://localhost:5173/src/main.tsx"></script>' : '<script type="module" src="/assets/index.js"></script>'}
        </body>
      </html>
    `);
  }
}
