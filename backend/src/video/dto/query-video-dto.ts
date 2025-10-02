/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';
import { Platform } from './create-video-dto';

export class QueryVideoDto {
  @IsOptional()
  @IsEnum(Platform)
  platform?: Platform;

  @IsOptional()
  @IsString()
  hashtag?: string;

  // search theo tiêu đề
  @IsOptional()
  @IsString()
  title?: string;

  // lọc theo createdAt
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 12;

  // createdAt:desc | updatedAt:asc | views:desc | likes:asc
  @IsOptional()
  @IsString()
  sort?: string;
}