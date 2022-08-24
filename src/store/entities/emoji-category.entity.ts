import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImageFile } from './image-file.entity';

@Entity({ name: 'emoji_category' })
export class EmojiCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ImageFile, (imageFile) => imageFile.emojiInfo, {
    cascade: true,
  })
  @JoinColumn()
  imageFile: ImageFile;

  @Column({
    name: 'author_name',
    default: '',
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
