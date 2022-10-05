import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserMember } from './user-member.entity';

@Entity({ name: 'user_token' })
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => UserMember, (user) => user.userToken)
  userMember: UserMember;

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
