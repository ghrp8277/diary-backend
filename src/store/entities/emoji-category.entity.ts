import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { EmojiInfo } from './emoji-info.entity';
import { EmojiTag } from './emoji-tag.entity';

@Entity({ name: 'emoji_category' })
export class EmojiCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToMany(() => EmojiInfo, (emojiInfo: EmojiInfo) => emojiInfo.emojiCategory)
  // emojiInfoes: EmojiInfo[];

  @OneToMany(() => EmojiTag, (emojiTag: EmojiTag) => emojiTag.emojiCategory)
  emojiTags: EmojiTag[];

  @Column({
    name: 'category_name',
    nullable: false,
    comment: '카테고리 명',
    type: 'varchar',
  })
  category_name: string;

  @Column({
    name: 'category_value',
    nullable: false,
    comment: '카테고리 값',
    type: 'varchar',
  })
  category_value: string;
}
