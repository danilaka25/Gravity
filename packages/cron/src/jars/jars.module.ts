import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jar } from './jar.entity';
import { JarsService } from './jars.service';
import { JarsController } from './jars.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Jar])],
  providers: [JarsService],
})
export class JarsModule { }
