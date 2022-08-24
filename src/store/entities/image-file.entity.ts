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
import { EmojiInfo } from './emoji-info.entity';
import { EmojiCategory } from './emoji-category.entity';

@Entity({ name: 'image_file' })
@Unique(['file_path'])
export class ImageFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserMember, (user: UserMember) => user)
  @JoinColumn({ name: 'user_member_id' })
  user_member?: UserMember;

  @Column()
  user_member_id: number;

  @OneToOne(() => EmojiInfo, (emojiInfo) => emojiInfo.imageFile, {
    // emojiinfo가 삭제될시 관련된 imagefile도 삭제
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  emojiInfo: EmojiInfo;

  @OneToOne(() => EmojiCategory, (emojiCategory) => emojiCategory.imageFile, {
    // emojiinfo가 삭제될시 관련된 imagefile도 삭제
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  emojiCategory: EmojiCategory;

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
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '이미지 타입',
  })
  mimeType: string;

  @Column({
    nullable: false,
    comment: '이미지 사이즈',
  })
  file_size: number;
}
