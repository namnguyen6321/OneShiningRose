import { PrismaService } from '../../prisma.service';
import {
  CreateVideoInput,
  FindQuery,
  VideoRepository,
} from '../ports/video.repository';

export class PrismaVideoRepository implements VideoRepository {
  constructor(private prisma: PrismaService) {}

  private makeKey(d: CreateVideoInput) {
    return `${d.platform}:${d.externalId ?? d.title}`;
  }

  async upsertOne(dto: CreateVideoInput): Promise<any> {
    const uniqueKey = this.makeKey(dto);
    return this.prisma.video.upsert({
      where: { uniqueKey },
      update: {
        title: dto.title,
        thumbnail: dto.thumbnail,
        views: dto.views,
        likes: dto.likes,
        hashtags: dto.hashtags ?? [],
      },
      create: {
        uniqueKey,
        platform: dto.platform,
        title: dto.title,
        thumbnail: dto.thumbnail,
        views: dto.views ?? 0,
        likes: dto.likes ?? 0,
        hashtags: dto.hashtags ?? [],
      },
    });
  }

  async upsertMany(items: CreateVideoInput[]): Promise<number> {
    await Promise.all(items.map((i) => this.upsertOne(i)));
    return items.length;
  }

  async findAll(q: FindQuery): Promise<{ data: any[]; total: number }> {
    const where: any = {};
    if (q.platform) where.platform = q.platform;
    if (q.hashtag) where.hashtags = { has: q.hashtag };
    if (q.q) where.title = { contains: q.q, mode: 'insensitive' };

    const orderBy: any = { [q.sortField]: q.sortDir };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.video.findMany({
        where,
        orderBy,
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      this.prisma.video.count({ where }),
    ]);
    return { data, total };
  }
}
