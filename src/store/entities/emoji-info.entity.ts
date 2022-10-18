import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmojiConfirm } from './emoji-confirm.entity';
import { EmojiCategory } from './emoji-category.entity';
import { EmojiTag } from './emoji-tag.entity';
import { json } from 'stream/consumers';
import { EmojiGroup } from './emoji-group.entity';

@Entity({ name: 'emoji_info' })
export class EmojiInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    () => EmojiConfirm,
    (emojiConfirm: EmojiConfirm) => emojiConfirm.emojiInfo,
  )
  emojiConfirm: EmojiConfirm;

  @Column({
    name: 'product_name',
    nullable: false,
    comment: '상품명',
    type: 'varchar',
  })
  product_name: string;

  @Column({
    name: 'author_name',
    nullable: false,
    comment: '작가명',
    type: 'varchar',
  })
  author_name: string;

  @Column({
    name: 'category',
    nullable: false,
    comment: '1차 카테고리',
    type: 'varchar',
  })
  category: string;

  @Column({
    name: 'tag',
    nullable: false,
    comment: '테그',
    type: 'varchar',
    readonly: false,
  })
  tag: string;

  @Column({
    name: 'comment',
    nullable: false,
    comment: '이모티콘 설명',
    type: 'text',
  })
  comment: string;
}
