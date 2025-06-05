import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { Chapter } from '@prisma/client';

@Controller('chapters')
export class ChaptersController {
  constructor(private chaptersService: ChaptersService) {}

  @Get('story/:storyId')
  async findByStoryId(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<Chapter[]> {
    return this.chaptersService.findByStoryId(storyId, page, limit);
  }
}