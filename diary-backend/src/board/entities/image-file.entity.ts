import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'image_file' })
export class ImageFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '이름',
  })
  name: string;

  @Column({
    type: 'longblob',
    nullable: false,
    comment: '이미지',
  })
  image_file: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '이미지 타입',
  })
  mimeType: string;
}
