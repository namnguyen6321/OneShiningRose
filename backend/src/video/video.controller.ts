import { Controller, Get, Post, Body } from '@nestjs/common';
import { VideoService } from './video.service';
import { Prisma } from '@prisma/client';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async findAll() {
    return this.videoService.findAll();
  }

  @Post()
  async createMany(@Body() videos: Prisma.VideoCreateManyInput[]) {
    return this.videoService.createMany(videos);
  }
}
