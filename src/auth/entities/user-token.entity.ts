import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { UserMember } from './user-member.entity';
import { UserOAuth } from './user-oauth.entity';

@Entity({ name: 'user_token' })
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => UserMember || UserOAuth, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user_id: number;

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
