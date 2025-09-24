import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.video.findMany();
  }

  async createMany(videos: Prisma.VideoCreateManyInput[]) {
    return this.prisma.video.createMany({
      data: videos,
    });
  }
}
