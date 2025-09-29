import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateVideoInput,
  FindQuery,
  VideoRepository,
} from '../ports/video.repository';

@Injectable()
export class PrismaVideoRepository implements VideoRepository {
  private prisma = new PrismaClient();

  private makeKey(d: CreateVideoInput) {
    return `${d.platform}:${d.externalId ?? d.title}`;
  }

  async upsertOne(dto: CreateVideoInput) {
    const uniqueKey = this.makeKey(dto);
    return this.prisma.video.upsert({
      where: { uniqueKey },
      update: {
        title: dto.title,
        thumbnail: dto.thumbnail,
        views: dto.views ?? 0,
        likes: dto.likes ?? 0,
        hashtags: dto.hashtags ?? [],
        watched: dto.watched ?? undefined,
      },
      create: {
        uniqueKey,
        platform: dto.platform as any,
        title: dto.title,
        thumbnail: dto.thumbnail,
        views: dto.views ?? 0,
        likes: dto.likes ?? 0,
        hashtags: dto.hashtags ?? [],
        watched: dto.watched ?? false,
      },
    });
  }

  async upsertMany(items: CreateVideoInput[]): Promise<number> {
    // Bỏ $transaction để tránh lỗi P2031
    for (const dto of items) {
      const uniqueKey = this.makeKey(dto);
      await this.prisma.video.upsert({
        where: { uniqueKey },
        update: {
          title: dto.title,
          thumbnail: dto.thumbnail,
          views: dto.views ?? 0,
          likes: dto.likes ?? 0,
          hashtags: dto.hashtags ?? [],
          watched: dto.watched ?? undefined,
        },
        create: {
          uniqueKey,
          platform: dto.platform as any,
          title: dto.title,
          thumbnail: dto.thumbnail,
          views: dto.views ?? 0,
          likes: dto.likes ?? 0,
          hashtags: dto.hashtags ?? [],
          watched: dto.watched ?? false,
        },
      });
    }

    return items.length;
  }

  async findAll(q: FindQuery): Promise<{ data: any[]; total: number }> {
    const where: any = {};
    if (q.platform) where.platform = q.platform as any;
    if (q.hashtag) where.hashtags = { has: q.hashtag };
    if (q.q) where.title = { contains: q.q, mode: 'insensitive' };
    if (q.from || q.to) {
      where.createdAt = {};
      if (q.from) where.createdAt.gte = new Date(q.from);
      if (q.to) where.createdAt.lte = new Date(q.to);
    }

    const orderBy: any = { [q.sortField || 'createdAt']: q.sortDir || 'desc' };

    // Gọi findMany và count riêng lẻ, không dùng transaction
    const data = await this.prisma.video.findMany({
      where,
      orderBy,
      skip: ((q.page ?? 1) - 1) * (q.limit ?? 20),
      take: q.limit ?? 20,
    });

    const total = await this.prisma.video.count({ where });

    return { data, total };
  }

  async markAsWatched(uniqueKey: string): Promise<any> {
    return this.prisma.video.update({
      where: { uniqueKey },
      data: { watched: true },
    });
  }
}
