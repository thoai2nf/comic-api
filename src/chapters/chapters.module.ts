import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { ChaptersRepository } from './chapters.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ChaptersController],
  providers: [ChaptersService, ChaptersRepository, PrismaService]
})
export class ChaptersModule {}
