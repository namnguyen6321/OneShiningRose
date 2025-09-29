export type CreateVideoInput = {
  platform: string;
  title: string;
  thumbnail?: string;
  views: number;
  likes: number;
  hashtags?: string[];
  externalId?: string;
  watched?: boolean;
};

export type FindQuery = {
  platform?: string;
  hashtag?: string;
  q?: string;
  from?: string; // ISO date
  to?: string; // ISO date
  page: number;
  limit: number;
  sortField: 'createdAt' | 'updatedAt' | 'views' | 'likes';
  sortDir: 'asc' | 'desc';
};

export interface VideoRepository {
  upsertOne(dto: CreateVideoInput): Promise<any>;
  upsertMany(items: CreateVideoInput[]): Promise<number>;
  findAll(q: FindQuery): Promise<{ data: any[]; total: number }>;
  markAsWatched(uniqueKey: string): Promise<any>;
}
