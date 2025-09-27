// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
// import { CreateVideoDto } from './dto/create-video-dto';
// import { QueryVideoDto } from './dto/query-video-dto';

// @Injectable()
// export class VideoService {
//   constructor(private prisma: PrismaService) {}

//   /** Tạo khóa chống trùng: platform:externalId | platform:title */
//   private makeKey(d: CreateVideoDto) {
//     return `${d.platform}:${d.externalId ?? d.title}`;
//   }

//   /** POST /video — upsert 1 bản ghi */
//   async createOne(dto: CreateVideoDto) {
//     const uniqueKey = this.makeKey(dto);
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
//       },
//     });
//   }

//   /** POST /video/bulk — upsert nhiều bản ghi */
//   async bulkUpsert(items: CreateVideoDto[]) {
//     const res = await Promise.all(items.map((i) => this.createOne(i)));
//     return { count: res.length };
//   }

//   /** GET /video — search/filter/pagination/sort */
//   async findAll(query: QueryVideoDto) {
//     const {
//       platform,
//       hashtag,
//       page = 1,
//       limit = 12,
//       q,
//       sort = 'updatedAt:desc',
//     } = query;

//     // any để tương thích mọi version Prisma + Mongo
//     const where: any = {};
//     if (platform) where.platform = platform;
//     if (hashtag) where.hashtags = { has: hashtag };
//     if (q) where.title = { contains: q, mode: 'insensitive' };

//     const [f, d] = (sort || '').split(':');
//     const allowed = new Set(['createdAt', 'updatedAt', 'views', 'likes']);
//     const field = allowed.has(f || '') ? f : 'updatedAt';
//     const orderBy: any = { [field as string]: d === 'asc' ? 'asc' : 'desc' };

//     const [data, total] = await this.prisma.$transaction([
//       this.prisma.video.findMany({
//         where,
//         orderBy,
//         skip: (page - 1) * limit,
//         take: limit,
//       }),
//       this.prisma.video.count({ where }),
//     ]);

//     return {
//       data,
//       meta: {
//         page,
//         limit,
//         total,
//         totalPages: Math.max(1, Math.ceil(total / limit)),
//       },
//     };
//   }
// }

import { Injectable, Inject } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video-dto';
import { QueryVideoDto } from './dto/query-video-dto';
import { CreateVideoInput } from './ports/video.repository';
import type { VideoRepository } from './ports/video.repository';

export const VIDEO_REPOSITORY = 'VIDEO_REPOSITORY';

@Injectable()
export class VideoService {
  constructor(@Inject(VIDEO_REPOSITORY) private repo: VideoRepository) {}

  async createOne(dto: CreateVideoDto) {
    return this.repo.upsertOne(dto as unknown as CreateVideoInput);
  }

  async bulkUpsert(items: CreateVideoDto[]) {
    const count = await this.repo.upsertMany(
      items as unknown as CreateVideoInput[],
    );
    return { count };
  }

  async findAll(query: QueryVideoDto) {
    const {
      platform,
      hashtag,
      page = 1,
      limit = 12,
      q,
      sort = 'updatedAt:desc',
    } = query;
    const [f, d] = (sort || '').split(':');
    const allowed = new Set(['createdAt', 'updatedAt', 'views', 'likes']);
    const sortField = (allowed.has(f || '') ? f : 'updatedAt') as
      | 'createdAt'
      | 'updatedAt'
      | 'views'
      | 'likes';
    const sortDir = d === 'asc' ? 'asc' : 'desc';

    const { data, total } = await this.repo.findAll({
      platform,
      hashtag,
      q,
      page,
      limit,
      sortField,
      sortDir,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }
}
