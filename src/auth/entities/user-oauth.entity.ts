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
  
  @Entity({ name: 'user_oauth' })
  @Unique(['username'])
  export class UserOAuth extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;
  
    @OneToOne(() => UserToken, (userToken) => userToken.id, {
      nullable: true,
      eager: true,
      cascade: ['remove'],
    })
    @JoinColumn({ name: 'user_token_id' })
    user_token_id: number;
  
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
  