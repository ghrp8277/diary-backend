import { UserMember } from 'src/auth/entities/user-member.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'image_file' })
@Unique(['original_name'])
export class ImageFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserMember, (user: UserMember) => user, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_member_id' })
  user_member?: UserMember;

  @Column({ nullable: true })
  user_member_id: number

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '이미지 파일명',
  })
  original_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    comment: '파일 경로',
  })
  file_path: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '이미지 타입',
  })
  mimeType: string;

  @Column({
    nullable: false,
    comment: '이미지 사이즈'
  })
  file_size: number;
}
