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

@Controller('video')
export class VideoController {
  constructor(private readonly service: VideoService) {}

  //thêm cập nhật nhiều video
  @Post('bulk')
  bulk(
    @Headers('x-ingest-token') token: string,
    @Body() items: CreateVideoDto[],
  ) {
    if (token !== process.env.INGEST_TOKEN)
      return { statusCode: 401, message: 'Unauthorized' };
    return this.service.bulkUpsert(items);
  }

  //find all có phân trang
  @Get('all')
  findAll(@Query('page') page = 1, @Query('limit') limit = 12) {
    return this.service.getAllVideos(Number(page), Number(limit));
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
