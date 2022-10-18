import { EntityRepository, Repository } from 'typeorm';
import { EmojiGroupItem } from '../entities/emoji-group-item.entity';
import { EmojiGroup } from '../entities/emoji-group.entity';

@EntityRepository(EmojiGroupItem)
export class EmojiGroupItemRepository extends Repository<EmojiGroupItem> {
  async createEmojiGroupItem(
    title: string,
    items: number[],
    emojiGroup: EmojiGroup,
  ): Promise<void> {
    const groupItem = this.create({
      title,
      items,
      emojiGroup,
    });

    await this.save(groupItem);
  }

  async findEmojiGroupItemByTitle(title: string): Promise<EmojiGroupItem> {
    return await this.findOne({ title });
  }

  async updateEmojiGroupItemByItems(
    id: number,
    items: number[],
  ): Promise<void> {
    await this.update(id, {
      items,
    });
  }
}
