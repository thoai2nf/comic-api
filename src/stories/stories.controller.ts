import { Controller, Post, Body, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Story } from '@prisma/client';

@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Post('import')
  async import(@Body() data: {
    story_id: string;
    name: string;
    img?: string;
    desc?: string;
    author?: string;
    status?: string;
    category?: string;
    data: { link: string; name: string; content?: string; chapter_id: string }[];
  }) {
    return this.storiesService.import(data);
  }

  @Get('search')
  async search(@Query('q') query: string): Promise<Story[]> {
    return this.storiesService.search(query);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Story & { chapterCount: number }> {
    return this.storiesService.findById(id);
  }
}