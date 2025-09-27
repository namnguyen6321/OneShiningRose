import {
  CreateVideoInput,
  FindQuery,
  VideoRepository,
} from '../ports/video.repository';

type VideoEntity = {
  id: string;
  uniqueKey: string;
  platform: string;
  title: string;
  thumbnail?: string;
  views: number;
  likes: number;
  hashtags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export class MemoryVideoRepository implements VideoRepository {
  private store: VideoEntity[] = [];

  private makeKey(d: CreateVideoInput) {
    return `${d.platform}:${d.externalId ?? d.title}`;
  }
  private rid() {
    return Math.random().toString(36).slice(2, 10);
  }

  async upsertOne(dto: CreateVideoInput): Promise<any> {
    const key = this.makeKey(dto);
    const now = new Date();
    const idx = this.store.findIndex((v) => v.uniqueKey === key);
    if (idx >= 0) {
      this.store[idx] = {
        ...this.store[idx],
        title: dto.title,
        thumbnail: dto.thumbnail,
        views: dto.views ?? 0,
        likes: dto.likes ?? 0,
        hashtags: dto.hashtags ?? [],
        updatedAt: now,
      };
      return this.store[idx];
    }
    const item: VideoEntity = {
      id: this.rid(),
      uniqueKey: key,
      platform: dto.platform,
      title: dto.title,
      thumbnail: dto.thumbnail,
      views: dto.views ?? 0,
      likes: dto.likes ?? 0,
      hashtags: dto.hashtags ?? [],
      createdAt: now,
      updatedAt: now,
    };
    this.store.push(item);
    return item;
  }

  async upsertMany(items: CreateVideoInput[]): Promise<number> {
    await Promise.all(items.map((i) => this.upsertOne(i)));
    return items.length;
  }

  async findAll(q: FindQuery): Promise<{ data: any[]; total: number }> {
    let list = [...this.store];

    if (q.platform) list = list.filter((v) => v.platform === q.platform);
    if (typeof q.hashtag === 'string')
      list = list.filter((v) => v.hashtags.includes(q.hashtag as string));
    if (q.q) {
      const s = q.q.toLowerCase();
      list = list.filter((v) => v.title.toLowerCase().includes(s));
    }

    list.sort((a: any, b: any) => {
      const va = a[q.sortField];
      const vb = b[q.sortField];
      const cmp = va > vb ? 1 : va < vb ? -1 : 0;
      return q.sortDir === 'asc' ? cmp : -cmp;
    });

    const total = list.length;
    const start = (q.page - 1) * q.limit;
    const data = list.slice(start, start + q.limit);
    return { data, total };
  }
}
