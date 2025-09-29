import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoModule } from './video/video.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), VideoModule],
})
export class AppModule {}
