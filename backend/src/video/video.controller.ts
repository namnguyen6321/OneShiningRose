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

  // // POST /video
  // @Post()
  // createOne(@Body() dto: CreateVideoDto) {
  //   return this.service.createOne(dto);
  // }

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
  //find all
  // GET /video?platform=&hashtag=&q=&from=&to=&sort=views:desc&page=1&limit=12
  @Get()
  findAll(@Query() q: QueryVideoDto) {
    return this.service.findAll(q);
  }
  //search by title
  // GET /video/search?q=funny
  @Get('search')
  findByTitle(
    @Query('q') q?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 12,
  ) {
    return this.service.searchByTitle(q ?? '', Number(page), Number(limit));
  }

  // GET /video/filter?platform=&title(q)=&hashtag=&from=&to=&page=&limit=&sort=

  @Get('filter')
  filter(@Query() q: QueryVideoDto) {
    return this.service.findAll(q);
  }

  // PATCH /video/:uniqueKey/watched
  @Patch(':uniqueKey/watched')
  markAsWatched(@Param('uniqueKey') uniqueKey: string) {
    return this.service.markAsWatched(uniqueKey);
  }

  // GET /video/hashtags?platform=&q=&from=&to=
  @Get('hashtags')
  hashtags(@Query() q: QueryVideoDto) {
    return this.service.listHashtags(q);
  }
}
