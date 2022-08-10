import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'image_file' })
export class ImageFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
