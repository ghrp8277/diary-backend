import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserMember } from './user-member.entity';
import { UserOAuth } from './user-oauth.entity';

@Entity({ name: 'user_token' })
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => UserMember, (user) => user.user_token)
  user_member: UserMember;

  @OneToOne(() => UserOAuth, (user) => user.user_token)
  user_oauth: UserOAuth;

  @Column({ type: 'text', nullable: false, comment: '리프레시토큰' })
  token: string;

  @CreateDateColumn({
    type: 'datetime',
    name: 'create_at',
    nullable: false,
    default: () => 'NOW()',
  })
  create_at: Date;
}
