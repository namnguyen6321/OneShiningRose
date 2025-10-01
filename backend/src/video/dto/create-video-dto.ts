/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export enum Platform {
  youtube = 'youtube',
  tiktok = 'tiktok',
}

export class CreateVideoDto {
  @IsEnum(Platform)
  platform: Platform;

  @IsString()
  title: string;

  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @IsInt()
  @Min(0)
  views: number;

  @IsInt()
  @Min(0)
  likes: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  hashtags?: string[];

  // ID gốc của nền tảng, chống trùng
  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  watched?: boolean;
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsUrl()
  embedUrl?: string;
}
