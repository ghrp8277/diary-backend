import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserToken } from './user-token.entity';
import { UserInfo } from './user-info.entity';
import { Board } from 'src/board/entities/board.entity';
import { EmojiConfirm } from 'src/store/entities/emoji-confirm.entity';

@Entity({ name: 'user_member' })
@Unique(['username'])
export class UserMember extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => UserToken, (userToken) => userToken.user_member, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'user_token_id', referencedColumnName: 'id' })
  user_token: UserToken;

  @OneToOne(() => UserInfo, (userInfo: UserInfo) => userInfo.user_member, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'user_info_id', referencedColumnName: 'id' })
  user_info: UserInfo;

  // 게시글
  @OneToMany(() => Board, (board) => board.user_member)
  boards: Board[];

  // 이미지 파일
  @OneToMany(() => EmojiConfirm, (emojiConfirm) => emojiConfirm.user_member)
  emoji_confirms: EmojiConfirm[];

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
