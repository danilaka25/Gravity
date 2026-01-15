import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { MonobankService } from './monobank.service';

@Controller('monobank')
export class MonobankController {
  constructor(private readonly monobankService: MonobankService) {}

  @Get('jar')
  async getJarData() {
    try {
      const data = await this.monobankService.fetchJarData();
      if (!data) {
        throw new HttpException(
          { error: 'Failed to fetch jar data' },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        { error: 'Failed to fetch monobank data', details: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
