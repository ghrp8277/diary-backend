import { EntityRepository, Repository } from 'typeorm';
import { EmojiCategory } from '../entities/emoji-category.entity';
import { EmojiTag } from '../entities/emoji-tag.entity';

@EntityRepository(EmojiTag)
export class EmojiTagRepository extends Repository<EmojiTag> {
  async findTagByCategoryValue(category_value: string): Promise<EmojiTag[]> {
    const categories = await this.createQueryBuilder('tag')
      .leftJoinAndSelect('tag.emojiCategory', 'category')
      .where('category.category_value = :category_value', { category_value })
      .getMany();

    return categories;
  }
}
