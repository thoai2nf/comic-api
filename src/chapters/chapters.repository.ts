import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chapter } from '@prisma/client';

@Injectable()
export class ChaptersRepository {
  constructor(private prisma: PrismaService) {}

  async findByInitId(initId: string): Promise<Chapter | null> {
    return this.prisma.chapter.findUnique({ where: { init_id: initId } });
  }

  async create(data: Omit<Chapter, 'id' | 'created_at' | 'updated_at'>): Promise<Chapter> {
    return this.prisma.chapter.create({ data });
  }

  async update(id: number, data: Partial<Omit<Chapter, 'id' | 'created_at' | 'updated_at'>>): Promise<Chapter> {
    return this.prisma.chapter.update({ where: { id }, data });
  }

  async search(query: string): Promise<Chapter[]> {
    return this.prisma.chapter.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  async findByStoryId(storyId: number, page: number, limit: number): Promise<Chapter[]> {
    return this.prisma.chapter.findMany({
      where: { story_id: storyId },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}