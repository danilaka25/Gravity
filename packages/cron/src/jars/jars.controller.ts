import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { JarsService } from './jars.service';
import { Jar } from './jar.entity';

@Controller('api/jars')
export class JarsController {
  constructor(private readonly jarsService: JarsService) {}

  @Get()
  async findAll(): Promise<Jar[]> {
    return this.jarsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Jar | null> {
    return this.jarsService.findOne(id);
  }

  @Post()
  async create(@Body() body: { jarUrl: string; authorNickname: string }): Promise<Jar> {
    return this.jarsService.create(body.jarUrl, body.authorNickname);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { jarUrl: string; authorNickname: string },
  ): Promise<Jar | null> {
    return this.jarsService.update(id, body.jarUrl, body.authorNickname);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.jarsService.delete(id);
  }
}
