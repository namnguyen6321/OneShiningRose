import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService, VIDEO_REPOSITORY } from './video.service';
import { PrismaService } from '../prisma.service';
import { MemoryVideoRepository } from './adapters/memory-video.repository';
import { PrismaVideoRepository } from './adapters/prisma-video.repository';

@Module({
  controllers: [VideoController],
  providers: [
    PrismaService,
    VideoService,
    {
      provide: VIDEO_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        const useMock =
          !process.env.DATABASE_URL || process.env.USE_MOCK_DB === '1';
        if (useMock) return new MemoryVideoRepository();
        return new PrismaVideoRepository(prisma);
      },
      inject: [PrismaService],
    },
  ],
  exports: [VideoService],
})
export class VideoModule {}
