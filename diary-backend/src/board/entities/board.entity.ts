import { UserMember } from 'src/auth/entities/user-member.entity';
import { UserOAuth } from 'src/auth/entities/user-oauth.entity';
import {
  BaseEntity,
  JoinColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmotionFile } from './emotion-file.entity';

@Entity({ name: 'board' })
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserMember, (user: UserMember) => user, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_member_id' })
  user_member?: UserMember;

  @Column({ nullable: true })
  user_member_id: number

  @ManyToOne(() => UserOAuth, (user: UserOAuth) => user, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_oauth_id' })
  user_oauth?: UserOAuth;

  @Column({ nullable: true })
  user_oauth_id: number

  @Column({
    type: 'varchar',
    nullable: false,
    comment: '게시판 머릿말',
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: '게시판 내용',
  })
  content: string;

  @OneToMany(() => EmotionFile, (emotionFile) => emotionFile.board, {
    cascade: ["remove"]
  })
  emotion_files: EmotionFile[];

  @Column({
    name: 'datetime',
    nullable: false,
    update: false,
    comment: '글작성일',
  })
  datetime: Date;

  // @UpdateDateColumn({
  //   name: 'update_at',
  //   nullable: false,
  //   comment: '수정일',
  //   default: () => 'NOW()',
  // })
  // updatedAt: Date;

  // @BeforeInsert()
  // protected beforeInsert() {
  //   this.createdAt = new Date();
  //   this.updatedAt = new Date();
  // }

  // @BeforeUpdate()
  // protected beforeUpdate() {
  //   this.updatedAt = new Date();
  // }
}
