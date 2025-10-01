import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService, VIDEO_REPOSITORY } from './video.service';
// Chọn 1 trong 2 repo:
// import { MemoryVideoRepository } from './adapters/memory.video.repository';
import { PrismaVideoRepository } from './adapters/prisma-video.repository';
@Module({
  controllers: [VideoController],
  providers: [
    VideoService,
    // Dev/test:
    // { provide: VIDEO_REPOSITORY, useClass: MemoryVideoRepository },

    // Prod:
    { provide: VIDEO_REPOSITORY, useClass: PrismaVideoRepository },
  ],
  exports: [VideoService],
})
export class VideoModule {}
