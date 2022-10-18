import { EntityRepository, Repository } from 'typeorm';
import { EmojiGroup } from '../entities/emoji-group.entity';

@EntityRepository(EmojiGroup)
export class EmojiGroupRepository extends Repository<EmojiGroup> {
  async createEmojiGroup(
    title: string,
    bg_color: string,
    text_color: string,
  ): Promise<void> {
    const emoji_group = this.create({
      bg_color,
      text_color,
      title,
    });

    await this.save(emoji_group);
  }

  async findEmojiGroupByTitle(title: string): Promise<EmojiGroup> {
    return await this.findOne({
      title,
    });
  }

  async findAllEmojiGroup(): Promise<EmojiGroup[]> {
    const group = await this.createQueryBuilder('emojiGroup')
      .leftJoinAndSelect('emojiGroup.emojiGroupItems', 'emojiGroupItems')
      .select([
        'emojiGroup.id',
        'emojiGroup.bg_color',
        'emojiGroup.text_color',
        'emojiGroup.title',
        'emojiGroupItems.id',
        'emojiGroupItems.title',
        'emojiGroupItems.items',
      ])
      .orderBy('emojiGroup.id', 'ASC')
      .limit(11)
      .getMany();

    return group;
  }
}
