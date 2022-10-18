import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { EmojiCategory } from './emoji-category.entity';
import { EmojiInfo } from './emoji-info.entity';

@Entity({ name: 'emoji_tag' })
export class EmojiTag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => EmojiCategory,
    (emojiCategory: EmojiCategory) => emojiCategory.emojiTags,
  )
  @JoinColumn({ name: 'emoji_category_id', referencedColumnName: 'id' })
  emojiCategory: EmojiCategory;

  // @ManyToOne(() => EmojiInfo, (emojiInfo: EmojiInfo) => emojiInfo.emojiTags)
  // @JoinColumn({ name: 'emoji_info_id', referencedColumnName: 'id' })
  // emojiInfo: EmojiInfo;

  @Column({
    name: 'tag_name',
    nullable: false,
    comment: '태그 명',
    type: 'varchar',
    unique: true,
  })
  tag_name: string;

  @Column({
    name: 'tag_value',
    nullable: false,
    comment: '태그 값',
    type: 'varchar',
    unique: true,
  })
  tag_value: string;
}
