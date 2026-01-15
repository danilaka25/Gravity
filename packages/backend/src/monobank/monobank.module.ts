import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonobankService } from './monobank.service';
import { MonobankController } from './monobank.controller';
import { Jar } from '../jars/jar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jar]),
  ],
  providers: [MonobankService],
  controllers: [MonobankController],
})
export class MonobankModule { }
