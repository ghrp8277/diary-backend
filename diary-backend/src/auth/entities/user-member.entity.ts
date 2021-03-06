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
import { UserToken } from './user-token.entity';
import { UserInfo } from './user-info.entity';
import { Board } from 'src/board/entities/board.entity';

@Entity({ name: 'user_member' })
@Unique(['username'])
export class UserMember extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => UserToken, (userToken) => userToken.id, {
    nullable: true,
    eager: true,
    cascade: ['remove'],
  })
  @JoinColumn({ name: 'user_token_id' })
  user_token_id: number;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.id, {
    nullable: true,
    eager: true,
    cascade: ['remove'],
  })
  @JoinColumn({ name: 'user_info_id' })
  user_info_id: number;

  // 게시글
  @OneToMany(() => Board, (board) => board.user_member)
  boards: Board[];

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '계정명',
  })
  username: string;

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
