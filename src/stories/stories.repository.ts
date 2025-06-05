import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Story } from '@prisma/client';

@Injectable()
export class StoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findByInitId(initId: string): Promise<Story | null> {
    return this.prisma.story.findUnique({ where: { init_id: initId } });
  }

  async create(data: Omit<Story, 'id' | 'created_at' | 'updated_at'>): Promise<Story> {
    return this.prisma.story.create({ data });
  }

  async update(id: number, data: Partial<Omit<Story, 'id' | 'created_at' | 'updated_at'>>): Promise<Story> {
    return this.prisma.story.update({ where: { id }, data });
  }

  async search(query: string): Promise<Story[]> {
    return this.prisma.story.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { desc: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  async findById(id: number): Promise<Story & { _count: { chapters: number } }> {
    return this.prisma.story.findUnique({
      where: { id },
      include: { _count: { select: { chapters: true } } },
    });
  }

  async findMany(where: any): Promise<Story[]> {
    return this.prisma.story.findMany({ where });
  }
}