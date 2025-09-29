import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService, VIDEO_REPOSITORY } from './video.service';
import { PrismaService } from '../prisma.service';
import { PrismaVideoRepository } from './adapters/prisma-video.repository';

@Module({
  controllers: [VideoController],
  providers: [
    PrismaService,
    VideoService,
    {
      provide: VIDEO_REPOSITORY,
      useClass: PrismaVideoRepository,
    },
  ],
  exports: [VideoService],
})
export class VideoModule {}
