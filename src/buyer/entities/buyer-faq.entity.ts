import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'buyer_faq' })
export class BuyerFAQ extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'title',
    nullable: false,
    comment: 'faq 글 제목',
    type: 'varchar',
  })
  title: string;

  @Column({
    name: 'content',
    nullable: false,
    comment: 'faq 글 내용',
    type: 'text',
  })
  content: string;

  @Column({
    name: 'username',
    nullable: false,
    comment: '등록자',
    type: 'varchar',
  })
  username: string;

  @Column({
    name: 'is_visible',
    nullable: false,
    default: true,
    comment: '글 보이기 여부',
    type: 'boolean',
  })
  is_visible: boolean;

  @CreateDateColumn({
    name: 'create_at',
    nullable: false,
    comment: '등록일',
    default: () => 'NOW()',
  })
  createdAt: Date;
}
