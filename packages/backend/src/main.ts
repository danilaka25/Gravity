import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files from public folder
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  
  // Enable CORS with frontend URL
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      frontendUrl,
    ],
    credentials: true,
  });
  
  // Add livereload in development
  if (process.env.NODE_ENV === 'development') {
    const livereload = require('livereload');
    const server = livereload.createServer({
      exts: ['ts', 'json'],
      port: 35729,
      delay: 100
    });
    server.watch([process.cwd() + '/dist']);
  }
  
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
