import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';

@Injectable()
export class MonobankService {
  private readonly logger = new Logger(MonobankService.name);
  private readonly JAR_URL = 'https://send.monobank.ua/jar/4goSfKKvPn';
  private lastData: any = null;
  private browser: puppeteer.Browser | null = null;

  async onModuleInit() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

  @Cron(CronExpression.EVERY_5_MINUTES
  )
  async fetchJarData() {
    try {
      if (!this.browser) {
        this.logger.warn('Браузер не инициализирован');
        return this.getLastData();
      }

      const page = await this.browser.newPage();
      await page.goto(this.JAR_URL, { waitUntil: 'networkidle2', timeout: 30000 });

      // Получаем данные из DOM или window объекта
      const jarData = (await page.evaluate(() => {
        // Пробуем получить из window объекта (самый надежный способ)
        const windowAny = (globalThis as any);
        if (windowAny.window && windowAny.window.jar) {
          return windowAny.window.jar;
        }
        if (windowAny.jar) {
          return windowAny.jar;
        }
        
        // Парсим из DOM если доступно
        const docObj = windowAny.document || null;
        if (!docObj) return null;
        
        // Ищем title в заголовке
        const titleEl = docObj.querySelector('h1');
        
        // Ищем все stats-data-value элементы
        const statsDataValues = docObj.querySelectorAll('.stats-data-value');
        let accumulated = '';
        let goal = '';
        
        // Парсим каждый элемент
        statsDataValues.forEach((el: any, index: number) => {
          const elText = el?.textContent || '';
          const cleanedValue = elText.replace(/\s/g, '');
          
          // Первый stats-data-value обычно это "Накопичено"
          if (index === 0) {
            accumulated = cleanedValue;
          }
          // Второй это "Ціль"
          if (index === 1) {
            goal = cleanedValue;
          }
        });
        
        return {
          title: titleEl?.textContent || 'Неизвестно',
          accumulated: accumulated,
          goal: goal,
          currencyCode: 980,
        };
      })) as any;

      await page.close();

      const result = {
        title: jarData.title || 'Неизвестно',
        accumulated: jarData.accumulated,
        goal: jarData.goal,
        currency: '₴',
        timestamp: new Date(),
      };

      this.lastData = result;

      this.logger.log(`
        ========== MONOBANK JAR DATA ==========
        📌 ${jarData.title || 'Неизвестно'}
        💰 Накопичено: ${jarData.accumulated} ₴
        🎯 Ціль: ${jarData.goal} ₴
        ======================================
      `);

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Ошибка при получении данных Monobank: ${errorMessage}`);
      return this.getLastData();
    }
  }

  private getLastData() {
    return (
      this.lastData || {
        title: 'Недоступно',
        accumulated: '',
        goal: '',
        currency: '₴',
        timestamp: new Date(),
        error: 'Данные не удалось получить',
      }
    );
  }
}
