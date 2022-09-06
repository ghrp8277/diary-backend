import { UserMember } from 'src/auth/entities/user-member.entity';
import { Product } from 'src/buyer/entities/product.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmojiInfo } from './emoji-info.entity';
import { ImageFile } from './image-file.entity';

enum IsConfirm {
  SUBMISSION_COMPLETE = 0,
  UNDER_REVIEW = 1,
  NOT_APPROVED = 2,
  APPROVED = 3,
}

@Entity({ name: 'emoji_confirm' })
export class EmojiConfirm extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserMember, (user: UserMember) => user)
  @JoinColumn({ name: 'user_member_id', referencedColumnName: 'id' })
  userMember: UserMember;

  @OneToMany(() => ImageFile, (imageFile: ImageFile) => imageFile.emojiConfirm)
  imageFiles: ImageFile[];

  @OneToOne(() => EmojiInfo, (emojiInfo: EmojiInfo) => emojiInfo.emojiConfirm)
  @JoinColumn({ name: 'emoji_info_id', referencedColumnName: 'id' })
  emojiInfo: EmojiInfo;

  @OneToOne(() => Product, (product: Product) => product.emojiConfirm)
  product: Product;

  @CreateDateColumn({
    name: 'create_at',
    nullable: false,
    comment: '등록일',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @Column({
    default: IsConfirm.SUBMISSION_COMPLETE,
    nullable: false,
    name: 'is_confirm',
    comment: '승인 여부',
    type: 'enum',
    enum: IsConfirm,
  })
  is_confirm: IsConfirm;
}
