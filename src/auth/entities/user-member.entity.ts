import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserToken } from './user-token.entity';
import { UserInfo } from './user-info.entity';
import { Board } from 'src/board/entities/board.entity';
import { EmojiConfirm } from 'src/store/entities/emoji-confirm.entity';
import { Favorite } from 'src/buyer/entities/favorite.entity';
import { PaymentHistory } from 'src/payment/entities/payment-history.entity';

@Entity({ name: 'user_member' })
@Unique(['username'])
export class UserMember extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => UserToken, (userToken) => userToken.userMember, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'user_token_id', referencedColumnName: 'id' })
  userToken: UserToken;

  @OneToOne(() => UserInfo, (userInfo: UserInfo) => userInfo.userMember, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'user_info_id', referencedColumnName: 'id' })
  userInfo: UserInfo;

  @OneToMany(() => Favorite, (favorite: Favorite) => favorite.userMember, {
    cascade: true,
  })
  favorite: Favorite[];

  // 게시글
  @OneToMany(() => Board, (board) => board.user_member, {
    cascade: true,
  })
  boards: Board[];

  // 이모티콘 정보들
  @OneToMany(() => EmojiConfirm, (emojiConfirm) => emojiConfirm.userMember, {
    cascade: true,
  })
  emojiConfirms: EmojiConfirm[];

  // 결제이력
  @OneToMany(
    () => PaymentHistory,
    (paymentHistory) => paymentHistory.userMember,
    {
      cascade: true,
    },
  )
  paymentHistories: PaymentHistory[];

  @ApiProperty({
    example: 'test',
    description: '아이디',
    required: true,
  })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '계정명',
  })
  username: string;

  @ApiProperty({
    example: 'testtest',
    description: '비밀번호',
    required: true,
  })
  @Column({
    type: 'varchar',
    nullable: false,
    comment: '비밀번호',
  })
  password: string;

  @Column({
    default: false,
    nullable: false,
    name: 'is_admin',
    comment: '관리자 여부',
  })
  is_admin: boolean;
}
