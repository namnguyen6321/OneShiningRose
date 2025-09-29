import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [VideoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
