import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video-dto';
import { QueryVideoDto } from './dto/query-video-dto';

@Controller('video')
export class VideoController {
  constructor(private readonly service: VideoService) {}

  // POST /video
  @Post()
  createOne(@Body() dto: CreateVideoDto) {
    return this.service.createOne(dto);
  }

  // POST /video/bulk  (yêu cầu header: X-Ingest-Token)
  @Post('bulk')
  bulk(
    @Headers('x-ingest-token') token: string,
    @Body() items: CreateVideoDto[],
  ) {
    if (token !== process.env.INGEST_TOKEN)
      return { statusCode: 401, message: 'Unauthorized' };
    return this.service.bulkUpsert(items);
  }

  // GET /video?platform=youtube&hashtag=cats&q=funny&sort=views:desc&page=1&limit=12
  @Get()
  findAll(@Query() q: QueryVideoDto) {
    return this.service.findAll(q);
  }
}
