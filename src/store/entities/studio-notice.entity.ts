import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'studio_notice' })
export class StudioNotice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'is_important',
    nullable: false,
    comment: '중요 게시글 확인',
    type: 'boolean',
    default: false,
  })
  is_important: boolean;

  @Column({
    name: 'title',
    nullable: false,
    comment: '공지사항 제목',
    type: 'varchar',
  })
  title: string;

  @Column({
    name: 'file_name',
    nullable: false,
    comment: '공지사항 내용 html 파일 이름',
    type: 'varchar',
  })
  file_name: string;

  @CreateDateColumn({
    name: 'create_at',
    nullable: false,
    comment: '등록일',
    default: () => 'NOW()',
  })
  createdAt: Date;
}
