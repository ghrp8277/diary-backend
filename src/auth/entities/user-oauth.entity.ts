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
import { Board } from 'src/board/entities/board.entity';

@Entity({ name: 'user_oauth' })
@Unique(['username'])
export class UserOAuth extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => UserToken, (userToken) => userToken, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'user_token_id', referencedColumnName: 'id' })
  user_token: UserToken;

  // 게시글
  @OneToMany(() => Board, (board) => board.user_oauth)
  boards: Board[];

  @Column({
    type: 'varchar',
    length: 40,
    nullable: false,
    comment: '계정명',
  })
  username: string;
}
