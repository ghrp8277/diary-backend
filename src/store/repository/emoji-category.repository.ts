import { EntityRepository, Repository } from 'typeorm';
import { EmojiCategory } from '../entities/emoji-category.entity';

@EntityRepository(EmojiCategory)
export class EmojiCategoryRepository extends Repository<EmojiCategory> {
  async findAllCategory(): Promise<EmojiCategory[]> {
    const categories = await this.find();

    return categories;
  }
}
