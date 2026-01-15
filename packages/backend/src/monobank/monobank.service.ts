import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as puppeteer from 'puppeteer';
import { Jar } from '../jars/jar.entity';

@Injectable()
export class MonobankService {
  private readonly logger = new Logger(MonobankService.name);
  private browser: puppeteer.Browser | null = null;
  private isUpdating = false;

  constructor(
    @InjectRepository(Jar)
    private jarRepository: Repository<Jar>,
  ) { }

  async onModuleInit() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      });
      this.logger.log('Puppeteer браузер инициализирован');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Ошибка инициализации браузера: ${errorMessage}`);
    }
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateAllJars() {
    if (this.isUpdating) {
      this.logger.warn('Обновление уже запущено, пропускаем');
      return;
    }

    if (!this.browser) {
      this.logger.warn('Браузер не инициализирован, пробуем запустить...');
      await this.onModuleInit();
      if (!this.browser) {
        this.logger.error('Не удалось запустить браузер, пропускаем обновление');
        return;
      }
    }

    this.isUpdating = true;
    try {
      const jars = await this.jarRepository.find();
      this.logger.log(`Начинаем обновление ${jars.length} банок`);

      for (const jar of jars) {
        try {
          const stats = await this.scrapeJar(jar.jarUrl);

          jar.accumulated = stats.accumulated || null;
          jar.goal = stats.goal || null;
          jar.lastStatsUpdate = new Date(); // Always update timestamp if we tried

          await this.jarRepository.save(jar);
          this.logger.log(`Обновлена банка ${jar.id}: ${stats.accumulated} / ${stats.goal}`);
        } catch (error) {
          this.logger.error(`Ошибка обновления банки ${jar.id} (${jar.jarUrl}): ${error}`);
          // If error, set nulls as requested
          jar.accumulated = null;
          jar.goal = null;
          jar.lastStatsUpdate = null;
          try {
            await this.jarRepository.save(jar);
          } catch (saveError) {
            this.logger.error(`Ошибка при сохранении статуса ошибки для банки ${jar.id}: ${saveError}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Ошибка при обновлении банок: ${error}`);
    } finally {
      this.isUpdating = false;
    }
  }

  private async scrapeJar(url: string): Promise<{ title: string; accumulated: string; goal: string }> {
    if (!this.browser) throw new Error('Browser not initialized');

    const page = await this.browser.newPage();
    try {
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const data = await page.evaluate(() => {
        const windowAny = (globalThis as any);
        // Try window.jar
        if (windowAny.jar) {
          return {
            title: 'Monobank Jar',
            accumulated: windowAny.jar.amount ? (windowAny.jar.amount / 100).toString() : '',
            goal: windowAny.jar.goal ? (windowAny.jar.goal / 100).toString() : '',
          };
        }

        // Try DOM
        const doc = (windowAny.document as any);
        const statsDataValues = doc.querySelectorAll('.stats-data-value');
        const values: string[] = [];
        statsDataValues.forEach((el: any) => {
          if (el.textContent) values.push(el.textContent.replace(/\s/g, ''));
        });

        // Usually 0 is accumulated, 1 is goal (if exists)
        return {
          title: doc.querySelector('h1')?.textContent || 'Unknown',
          accumulated: values[0] || '',
          goal: values[1] || '',
        };
      });

      return data;
    } finally {
      await page.close();
    }
  }
}
