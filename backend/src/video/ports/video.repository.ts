export type CreateVideoInput = {
  platform: string;
  title: string;
  thumbnail?: string;
  views: number;
  likes: number;
  hashtags?: string[];
  externalId?: string;
  watched?: boolean;
   videoUrl?: string;
  embedUrl?: string;
};

export type FindQuery = {
  platform?: string;
  hashtag?: string;
  title?: string;
  from?: string;
  to?: string;
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
