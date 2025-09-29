// import { PrismaService } from '../../prisma.service';
// import {
//   CreateVideoInput,
//   FindQuery,
//   VideoRepository,
// } from '../ports/video.repository';

// export class PrismaVideoRepository implements VideoRepository {
//   constructor(private prisma: PrismaService) {}

//   private makeKey(d: CreateVideoInput) {
//     return `${d.platform}:${d.externalId ?? d.title}`;
//   }

//   async upsertOne(dto: CreateVideoInput): Promise<any> {
//     const uniqueKey = this.makeKey(dto);
//     console.log('Upserting video key:', uniqueKey, 'title:', dto.title);
//     return this.prisma.video.upsert({
//       where: { uniqueKey },
//       update: {
//         title: dto.title,
//         thumbnail: dto.thumbnail,
//         views: dto.views,
//         likes: dto.likes,
//         hashtags: dto.hashtags ?? [],
//       },
//       create: {
//         uniqueKey,
//         platform: dto.platform,
//         title: dto.title,
//         thumbnail: dto.thumbnail,
//         views: dto.views ?? 0,
//         likes: dto.likes ?? 0,
//         hashtags: dto.hashtags ?? [],
//         watched: dto.watched ?? false,
//       },
//     });
//   }

//   async upsertMany(items: CreateVideoInput[]): Promise<number> {
//     await Promise.all(items.map((i) => this.upsertOne(i)));
//     return items.length;
//   }

//   async findAll(q: FindQuery): Promise<{ data: any[]; total: number }> {
//     const where: any = {};
//     if (q.platform) where.platform = q.platform;
//     if (q.hashtag) where.hashtags = { has: q.hashtag };
//     if (q.q) where.title = { contains: q.q, mode: 'insensitive' };

//     const orderBy: any = { [q.sortField]: q.sortDir };

//     const [data, total] = await this.prisma.$transaction([
//       this.prisma.video.findMany({
//         where,
//         orderBy,
//         skip: (q.page - 1) * q.limit,
//         take: q.limit,
//       }),
//       this.prisma.video.count({ where }),
//     ]);
//     return { data, total };
//   }
//   async markAsWatched(uniqueKey: string) {
//     return this.prisma.video.update({
//       where: { uniqueKey },
//       data: { watched: true },
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateVideoInput } from '../ports/video.repository';

@Injectable()
export class PrismaVideoRepository {
  private prisma = new PrismaClient();

  // Tạo key duy nhất dựa vào platform + title
  makeKey(dto: CreateVideoInput): string {
    return `${dto.platform}:${dto.title}`;
  }

  // --- Thay upsert bằng findUnique + create/update ---
  async upsertOne(dto: CreateVideoInput) {
    const uniqueKey = this.makeKey(dto);
    console.log('Upserting video key:', uniqueKey, 'title:', dto.title);

    const existing = await this.prisma.video.findUnique({
      where: { uniqueKey },
    });

    if (existing) {
      return this.prisma.video.update({
        where: { uniqueKey },
        data: {
          title: dto.title,
          thumbnail: dto.thumbnail,
          views: dto.views,
          likes: dto.likes,
          hashtags: dto.hashtags,
          watched: dto.watched,
          updatedAt: new Date(),
        },
      });
    } else {
      return this.prisma.video.create({
        data: {
          uniqueKey,
          platform: dto.platform,
          title: dto.title,
          thumbnail: dto.thumbnail,
          views: dto.views,
          likes: dto.likes,
          hashtags: dto.hashtags,
          watched: dto.watched,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  // Bulk upsert
  async upsertMany(dtos: CreateVideoInput[]) {
    return Promise.all(dtos.map((dto) => this.upsertOne(dto)));
  }
}
