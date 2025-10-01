import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateVideoInput,
  FindQuery,
  VideoRepository,
} from '../ports/video.repository';

@Injectable()
export class PrismaVideoRepository implements VideoRepository {
  //Khởi tạo prisma client để tương tác db
  private prisma = new PrismaClient();

  //tạo uniqueKey dựa trên platform và  externalId hoặc title
  private makeKey(d: CreateVideoInput) {
    return `${d.platform}:${d.externalId ?? d.title}`;
  }
  // nếu video tồn tại theo uniqueKey thì update không thì tạo mới
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
        videoUrl: dto.videoUrl,
        embedUrl: dto.embedUrl,
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
        videoUrl: dto.videoUrl,
        embedUrl: dto.embedUrl,
      },
    });
  }
  // lặp qua từng item  gọi upsertOne => số lượng video đã xử lí
  async upsertMany(items: CreateVideoInput[]): Promise<number> {
    for (const dto of items) {
      await this.upsertOne(dto);
    }
    return items.length;
  }

  //lấy danh sách theo điều kiện filter, phân trang sắp xếp
  async findAll(q: FindQuery): Promise<{ data: any[]; total: number }> {
    const where: any = {};
    // theo platform
    if (q.platform) where.platform = q.platform as any;
    //hashtag
    if (q.hashtag) where.hashtags = { has: q.hashtag };
    //title
    if (q.title) where.title = { contains: q.title, mode: 'insensitive' };
    // khoảng thời gian ngày tạo
    if (q.from || q.to) {
      where.createdAt = {};
      if (q.from) where.createdAt.gte = new Date(q.from);
      if (q.to) where.createdAt.lte = new Date(q.to);
    }
    // sắp xếp
    const orderBy: any = [
      { watched: 'asc' },
      {
        [q.sortField || 'createdAt']: q.sortDir || 'desc',
      },
    ];

    //lấy dữ liệu +phần trang
    const data = await this.prisma.video.findMany({
      where,
      orderBy,
      skip: ((q.page ?? 1) - 1) * (q.limit ?? 20),
      take: q.limit ?? 20,
    });

    //tổng số video
    const total = await this.prisma.video.count({ where });

    return { data, total };
  }

  //đánh dấu đã xem
  async markAsWatched(uniqueKey: string): Promise<any> {
    return this.prisma.video.update({
      where: { uniqueKey },
      data: { watched: true },
    });
  }
}
