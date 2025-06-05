import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { StoriesRepository } from './stories.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ChaptersRepository } from '../chapters/chapters.repository';

@Module({
  controllers: [StoriesController],
  providers: [StoriesService, StoriesRepository, PrismaService, ChaptersRepository],
})
export class StoriesModule {}