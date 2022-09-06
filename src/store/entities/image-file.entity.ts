import { UserMember } from 'src/auth/entities/user-member.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { EmojiConfirm } from './emoji-confirm.entity';

@Entity({ name: 'image_file' })
@Unique(['file_path'])
export class ImageFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => EmojiConfirm,
    (emojiConfirm: EmojiConfirm) => emojiConfirm.imageFiles,
  )
  @JoinColumn({ name: 'emoji_confirm_id', referencedColumnName: 'id' })
  emojiConfirm: EmojiConfirm;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '이미지 파일명',
  })
  original_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    comment: '파일 경로',
  })
  file_path: string;

  @Column({
    name: 'image_url',
    nullable: false,
    comment: '이모티콘 경로',
    type: 'varchar'
  })
  image_url: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '이미지 타입',
    name: 'mime_type'
  })
  mimeType: string;

  @Column({
    nullable: false,
    comment: '이미지 사이즈',
  })
  file_size: number;
}
