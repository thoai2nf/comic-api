import { Injectable } from '@nestjs/common';
import { ChaptersRepository } from './chapters.repository';
import { Chapter } from '@prisma/client';

@Injectable()
export class ChaptersService {
  constructor(private chaptersRepository: ChaptersRepository) {}

  async findByStoryId(storyId: number, page: number, limit: number): Promise<Chapter[]> {
    return this.chaptersRepository.findByStoryId(storyId, page, limit);
  }
}