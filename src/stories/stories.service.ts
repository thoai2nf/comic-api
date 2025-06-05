import { Injectable } from '@nestjs/common';
import { StoriesRepository } from './stories.repository';
import { ChaptersRepository } from '../chapters/chapters.repository';
import { Story, Chapter } from '@prisma/client';

@Injectable()
export class StoriesService {
  constructor(
    private storiesRepository: StoriesRepository,
    private chaptersRepository: ChaptersRepository,
  ) {}

  async import(data: {
    story_id: string;
    name: string;
    img?: string;
    desc?: string;
    author?: string;
    status?: string;
    category?: string;
    data: { link: string; name: string; content?: string; chapter_id: string }[];
  }) {
    let story = await this.storiesRepository.findByInitId(data.story_id);
    if (story) {
      story = await this.storiesRepository.update(story.id, {
        name: data.name,
        img: data.img,
        desc: data.desc,
        author: data.author,
        status: data.status,
        category: data.category,
      });
    } else {
      story = await this.storiesRepository.create({
        init_id: data.story_id,
        name: data.name,
        img: data.img,
        desc: data.desc,
        author: data.author,
        status: data.status,
        category: data.category,
      });
    }

    for (const chapterData of data.data) {
      let chapter = await this.chaptersRepository.findByInitId(chapterData.chapter_id);
      if (chapter) {
        await this.chaptersRepository.update(chapter.id, {
          name: chapterData.name,
          content: chapterData.content,
        });
      } else {
        await this.chaptersRepository.create({
          init_id: chapterData.chapter_id,
          story_id: story.id,
          name: chapterData.name,
          content: chapterData.content,
        });
      }
    }

    return story;
  }

  async search(query: string): Promise<Story[]> {
    const stories = await this.storiesRepository.search(query);
    const chapters = await this.chaptersRepository.search(query);
    const storyIdsFromChapters = new Set(chapters.map((chapter) => chapter.story_id));
    const additionalStories = await this.storiesRepository.findMany({
      where: { id: { in: Array.from(storyIdsFromChapters) } },
    });
    return [...stories, ...additionalStories];
  }

  async findById(id: number): Promise<Story & { chapterCount: number }> {
    const story = await this.storiesRepository.findById(id);
    if (!story) throw new Error('Story not found');
    return { ...story, chapterCount: story._count.chapters };
  }
}