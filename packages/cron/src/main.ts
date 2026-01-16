import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MonobankService } from './monobank/monobank.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const monobankService = app.get(MonobankService);
  await monobankService.updateAllJars();

  await app.close();
  process.exit(0);
}
bootstrap();
