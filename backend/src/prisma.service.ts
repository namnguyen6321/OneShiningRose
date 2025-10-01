import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  private get isMock() {
    // Không có DATABASE_URL hoặc USE_MOCK_DB=1 thì chạy mock
    return !process.env.DATABASE_URL || process.env.USE_MOCK_DB === '1';
  }

  constructor() {
    super({ log: ['warn', 'error'] });
  }

  async onModuleInit(): Promise<void> {
    if (this.isMock) {
      this.logger.warn(
        'DATABASE_URL not found or USE_MOCK_DB=1 → running in MOCK (in-memory) mode',
      );
      return;
    }
    await this.$connect();
    this.logger.log('Prisma connected');

    // Optional: tạo text index (Mongo)
    try {
      await this.$runCommandRaw({
        createIndexes: 'Video',
        indexes: [
          {
            name: 'text_title_hashtags',
            key: { title: 'text', hashtags: 'text' },
          },
        ],
      });
      this.logger.log('Ensured text index on Video(title, hashtags)');
    } catch (e) {
      this.logger.debug(`ensureIndexes skipped: ${(e as Error).message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.isMock) return;
    await this.$disconnect();
    this.logger.log('Prisma disconnected');
  }
}
