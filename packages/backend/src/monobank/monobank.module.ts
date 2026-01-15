import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MonobankService } from './monobank.service';
import { MonobankController } from './monobank.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [MonobankService],
  controllers: [MonobankController],
})
export class MonobankModule {}
