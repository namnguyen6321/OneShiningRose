// import { Module } from '@nestjs/common';
// import { VideoController } from './video.controller';
// import { VideoService } from './video.service';
// import { PrismaService } from '../prisma.service';

// @Module({
//   controllers: [VideoController],
//   providers: [VideoService, PrismaService],
// })
// export class VideoModule {}

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
      // useFactory: (prisma: PrismaService) => {
      //   const useMock =
      //     !process.env.DATABASE_URL || process.env.USE_MOCK_DB === '1';
      //   if (useMock) return new MemoryVideoRepository();
      //   return new PrismaVideoRepository(prisma);
      // },
      // inject: [PrismaService],
    },
  ],
  exports: [VideoService],
})
export class VideoModule {}
