import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video-dto';
import { QueryVideoDto } from './dto/query-video-dto';
import { UnauthorizedException } from '@nestjs/common';

@Controller('video')
export class VideoController {
  constructor(private readonly service: VideoService) {}

  //thêm cập nhật nhiều video
  @Post('bulk')
async bulk(
  @Headers('x-ingest-token') token: string,
  @Body() items: CreateVideoDto[],
) {
  if (token !== process.env.INGEST_TOKEN) {
    throw new UnauthorizedException('Invalid ingest token');
  }
  return this.service.bulkUpsert(items);
}


  //find all video youtube có phân trang
  @Get('youtube')
  getYoutubeVideos(@Query('page') page = 1, @Query('limit') limit = 12) {
    return this.service.getYoutubeVideos(Number(page), Number(limit));
  }

  // find all video tiktok
  @Get('tiktok')
  getTiktokVideos(@Query('page') page = 1, @Query('limit') limit = 12) {
    return this.service.getTikTokVideos(Number(page), Number(limit));
  }

  //tìm kiếm nhiều điều kiện
  // GET /video/find?q=funny&platform=&hashtag=&from=&to=&page=&limit=&sort=
  @Get('find')
  find(@Query() query: QueryVideoDto) {
    return this.service.searchVideos(query);
  }

  //đánh dấu đã xem
  // PATCH /video/:uniqueKey/watched
  @Patch(':uniqueKey/watched')
  markAsWatched(@Param('uniqueKey') uniqueKey: string) {
    return this.service.markAsWatched(uniqueKey);
  }
}
