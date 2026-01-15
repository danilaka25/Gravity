import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { MonobankService } from './monobank.service';

@Controller('monobank')
export class MonobankController {
  constructor(private readonly monobankService: MonobankService) { }

  @Get('update')
  async triggerUpdate() {
    try {
      this.monobankService.updateAllJars(); // Run in background
      return { message: 'Update triggered' };
    } catch (error) {
      throw new HttpException(
        { error: 'Failed to trigger update' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
