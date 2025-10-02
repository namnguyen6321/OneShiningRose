// src/video/video.service.ts
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video-dto';
import { QueryVideoDto } from './dto/query-video-dto';
import * as Ports from './ports/video.repository'; // <--- namespace import
import { platform } from 'os';

export const VIDEO_REPOSITORY = 'VIDEO_REPOSITORY';

@Injectable()
export class VideoService {
  constructor(
    @Inject(VIDEO_REPOSITORY)
    private readonly videoRepository: Ports.VideoRepository,
  ) {}

  //thêm hoặc cập nhật nhiều video cùng lúc
  async bulkUpsert(items: CreateVideoDto[]) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpException(
        'Body must be a non-empty array',
        HttpStatus.BAD_REQUEST,
      );
    }
    const count = await this.videoRepository.upsertMany(
      items as unknown as Ports.CreateVideoInput[],
    );
    return { count };
  }
  //lấy tất cả video có phần trnag trả về data+ metadata
  async getYoutubeVideos(page = 1, limit = 12) {
    const { data, total } = await this.videoRepository.findAll({
      page,
      limit,
      sortField: 'updatedAt',
      sortDir: 'desc',
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

  async getTikTokVideos(page = 1, limit = 12) {
    const { data, total } = await this.videoRepository.findAll({
      page,
      limit,
      sortField: 'updatedAt',
      sortDir: 'desc',
      platform: 'tiktok', // CHANGED
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

  // Tìm video theo nhiều điều kiện, có thể bỏ trống trường nào cũng được
  async searchVideos(query: QueryVideoDto) {
    const {
      title,
      hashtag,
      platform,
      from,
      to,
      page = 1,
      limit = 12,
      sort = 'updatedAt:desc',
    } = query;

    const [field, dir] = (sort || '').split(':');
    const allowed = new Set(['createdAt', 'updatedAt', 'views', 'likes']);
    const sortField = allowed.has(field || '') ? field : 'updatedAt';
    const sortDir = dir === 'asc' ? 'asc' : 'desc';

    const { data, total } = await this.videoRepository.findAll({
      title: title,
      hashtag,
      platform,
      from,
      to,
      page,
      limit,
      sortField: sortField as Ports.FindQuery['sortField'],
      sortDir: sortDir as Ports.FindQuery['sortDir'],
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

  //đánh dấu video đã xem
  async markAsWatched(uniqueKey: string) {
    const res = await this.videoRepository.markAsWatched(uniqueKey);
    if (!res) throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    return res;
  }
}
