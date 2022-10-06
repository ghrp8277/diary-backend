import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmojiTag } from './emoji-tag.entity';

@Entity({ name: 'emoji_category' })
export class EmojiCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => EmojiTag, (emojiTag: EmojiTag) => emojiTag.emojiCategory)
  emojiTags: EmojiTag[];

  @Column({
    name: 'category_name',
    nullable: false,
    comment: '카테고리 명',
    type: 'varchar',
    unique: true,
  })
  category_name: string;

  @Column({
    name: 'category_value',
    nullable: false,
    comment: '카테고리 값',
    type: 'varchar',
    unique: true,
  })
  category_value: string;
}
