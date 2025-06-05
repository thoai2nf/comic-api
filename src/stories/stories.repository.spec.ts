import { StoriesRepository } from './stories.repository';

describe('StoriesRepository', () => {
  it('should be defined', () => {
    expect(new StoriesRepository()).toBeDefined();
  });
});
