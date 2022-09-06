import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserMember } from './user-member.entity';

//Enum 설정
enum STATUS {
  PAUSE = 'PAUSE',
  ACTIVE = 'ACTIVE',
}

@Entity({ name: 'user_info' })
@Unique(['e_mail'])
export class UserInfo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => UserMember, (userMember) => userMember.userInfo)
  userMember: UserMember;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '인증받을 사용자 메일',
  })
  e_mail: string;

  @Column({
    type: 'enum',
    enum: STATUS,
    default: STATUS.ACTIVE,
    nullable: false,
    comment: '계정상태(ACTIVE, PAUSE)',
  })
  status: string;

  @Column({
    type: 'date',
    nullable: false,
    comment: '계정 유효기간(패키지 별 설정) Ex) 2021-12-14',
  })
  account_expired: Date;

  @Column({
    type: 'date',
    nullable: false,
    comment: '비밀번호 유효기간(주기적 업데이트) Ex) 2021-12-14',
  })
  password_expired: Date;

  @CreateDateColumn({
    name: 'create_at',
    nullable: false,
    comment: '생성일',
    default: () => 'NOW()',
  })
  createdAt: Date;
}
