import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LiveReloadMiddleware } from './livereload.middleware';
import { MonobankModule } from './monobank/monobank.module';
import { JarsModule } from './jars/jars.module';
import { Jar } from './jars/jar.entity';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Jar],
      synchronize: true,
      ssl: true,
    }),
    ScheduleModule.forRoot(),
    MonobankModule,
    JarsModule,
  ],
  providers: [AppService],
})
export class AppModule { }
