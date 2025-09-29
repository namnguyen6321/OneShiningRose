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
  thumbnail?: string | null;
  views: number;
  likes: number;
  hashtags: string[];
  watched: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toInt(n: unknown, def = 0) {
  const x = Number(n);
  return Number.isFinite(x) && x >= 0 ? Math.trunc(x) : def;
}

function toSlug(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function normPlatform(p?: string) {
  return (p || '').trim().toLowerCase();
}

function normHashtags(tags?: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  const set = new Set<string>();
  for (const t of tags) {
    if (typeof t === 'string') {
      const v = t.trim().toLowerCase();
      if (v) set.add(v);
    }
  }
  return [...set];
}

function makeKey(d: CreateVideoInput) {
  const platform = normPlatform(d.platform);
  const base =
    (d as any).externalId?.toString().trim() || toSlug(d.title || '');
  return `${platform}:${base}`;
}

export class MemoryVideoRepository implements VideoRepository {
  private store: VideoEntity[] = [];
  // uniqueKey -> index trong store
  private idx = new Map<string, number>();

  private rid() {
    return Math.random().toString(36).slice(2, 10);
  }

  private upsertIndex(key: string, index: number) {
    this.idx.set(key, index);
  }

  private findIndexByKey(key: string) {
    const i = this.idx.get(key);
    if (i === undefined) return -1;
    // phòng trường hợp lệch map (hiếm)
    if (!this.store[i] || this.store[i].uniqueKey !== key) {
      return this.store.findIndex((v) => v.uniqueKey === key);
    }
    return i;
  }

  async upsertOne(dto: CreateVideoInput): Promise<VideoEntity> {
    const key = makeKey(dto);
    const now = new Date();
    const i = this.findIndexByKey(key);

    const platform = normPlatform(dto.platform);
    const hashtags = normHashtags(dto.hashtags);

    if (i >= 0) {
      const current = this.store[i];
      const updated: VideoEntity = {
        ...current,
        platform, // giữ platform đã chuẩn hóa
        title: dto.title,
        thumbnail: dto.thumbnail ?? null,
        views: toInt(dto.views, current.views),
        likes: toInt(dto.likes, current.likes),
        hashtags: hashtags.length ? hashtags : current.hashtags,
        watched: dto.watched ?? current.watched,
        updatedAt: now,
      };
      this.store[i] = updated;
      this.upsertIndex(key, i);
      return updated;
    }

    const item: VideoEntity = {
      id: this.rid(),
      uniqueKey: key,
      platform,
      title: dto.title,
      thumbnail: dto.thumbnail ?? null,
      views: toInt(dto.views, 0),
      likes: toInt(dto.likes, 0),
      hashtags,
      watched: dto.watched ?? false,
      createdAt: now,
      updatedAt: now,
    };
    const newIndex = this.store.push(item) - 1;
    this.upsertIndex(key, newIndex);
    return item;
  }

  async upsertMany(items: CreateVideoInput[]): Promise<number> {
    // upsert tuần tự để đảm bảo thứ tự/định danh trong mock
    for (const i of items) {
      await this.upsertOne(i);
    }
    return items.length;
  }

  async findAll(q: FindQuery): Promise<{ data: VideoEntity[]; total: number }> {
    let list = this.store;

    // Lọc
    if (q.platform) {
      const p = normPlatform(q.platform);
      list = list.filter((v) => v.platform === p);
    }
    if (typeof (q as any).hashtag === 'string' && (q as any).hashtag) {
      const tag = (q as any).hashtag.toLowerCase();
      list = list.filter((v) => v.hashtags.includes(tag));
    }
    if ((q as any).q) {
      const s = ((q as any).q as string).toLowerCase().trim();
      if (s) {
        list = list.filter((v) => v.title.toLowerCase().includes(s));
      }
    }
    if ((q as any).from) {
      const t = Date.parse((q as any).from);
      if (!Number.isNaN(t)) {
        const from = new Date(t);
        list = list.filter((v) => v.createdAt >= from);
      }
    }
    if ((q as any).to) {
      const t = Date.parse((q as any).to);
      if (!Number.isNaN(t)) {
        const to = new Date(t);
        list = list.filter((v) => v.createdAt <= to);
      }
    }

    // Sort (ổn định + tie-breaker)
    const sf = q.sortField || 'updatedAt';
    const sd = q.sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      const va = (a as any)[sf];
      const vb = (b as any)[sf];
      let cmp = 0;
      if (va instanceof Date && vb instanceof Date)
        cmp = va.getTime() - vb.getTime();
      else if (typeof va === 'number' && typeof vb === 'number') cmp = va - vb;
      else cmp = ('' + va).localeCompare('' + vb);
      if (cmp === 0) {
        // tie-breaker để đảm bảo kết quả ổn định
        cmp = a.uniqueKey.localeCompare(b.uniqueKey);
      }
      return sd * cmp;
    });

    // Phân trang an toàn
    const total = list.length;
    const page = Math.max(1, Number(q.page || 1));
    const limit = Math.max(1, Number(q.limit || 12));
    const start = (page - 1) * limit;
    const data = list.slice(start, start + limit);

    return { data, total };
  }

  async markAsWatched(uniqueKey: string): Promise<VideoEntity | null> {
    const i = this.findIndexByKey(uniqueKey);
    if (i === -1) return null;
    const now = new Date();
    const updated = { ...this.store[i], watched: true, updatedAt: now };
    this.store[i] = updated;
    this.upsertIndex(uniqueKey, i);
    return updated;
  }

  // (tuỳ chọn) tiện cho test: reset store
  clear() {
    this.store = [];
    this.idx.clear();
  }
}
