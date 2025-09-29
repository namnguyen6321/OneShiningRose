// src/video/video.service.ts
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video-dto';
import { QueryVideoDto } from './dto/query-video-dto';
import * as Ports from './ports/video.repository'; // <--- namespace import

export const VIDEO_REPOSITORY = 'VIDEO_REPOSITORY';

@Injectable()
export class VideoService {
  constructor(
    @Inject(VIDEO_REPOSITORY) private readonly repo: Ports.VideoRepository,
  ) {}

  async createOne(dto: CreateVideoDto) {
    return this.repo.upsertOne(dto as unknown as Ports.CreateVideoInput);
  }

  async bulkUpsert(items: CreateVideoDto[]) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpException(
        'Body must be a non-empty array',
        HttpStatus.BAD_REQUEST,
      );
    }
    const count = await this.repo.upsertMany(
      items as unknown as Ports.CreateVideoInput[],
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
      from,
      to,
    } = query;

    const [f, d] = (sort || '').split(':');
    const allowed = new Set(['createdAt', 'updatedAt', 'views', 'likes']);
    const sortField = (
      allowed.has(f || '') ? f : 'updatedAt'
    ) as Ports.FindQuery['sortField'];
    const sortDir = (
      d === 'asc' ? 'asc' : 'desc'
    ) as Ports.FindQuery['sortDir'];

    const { data, total } = await this.repo.findAll({
      platform,
      hashtag,
      q,
      from,
      to,
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

  async searchByTitle(
    q: string,
    page = 1,
    limit = 12,
    sort = 'updatedAt:desc',
  ) {
    return this.findAll({ q, page, limit, sort } as any);
  }

  async markAsWatched(uniqueKey: string) {
    const res = await this.repo.markAsWatched(uniqueKey);
    if (!res) throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    return res;
  }

  async listHashtags(query: QueryVideoDto) {
    // giữ nguyên như bạn đã có, không ảnh hưởng tới lỗi
  }
}
