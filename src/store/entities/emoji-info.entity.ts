import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmojiConfirm } from './emoji-confirm.entity';

@Entity({ name: 'emoji_info' })
export class EmojiInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => EmojiConfirm,
    (emojiConfirm: EmojiConfirm) => emojiConfirm.emojiInfo,
  )
  @JoinColumn()
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
    comment: '카테고리',
    type: 'varchar',
  })
  category: string;

  @Column({
    name: 'tag',
    nullable: false,
    comment: '태그',
    type: 'varchar',
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
