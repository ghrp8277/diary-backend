import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity({ name: 'emotion_file' })
export class EmotionFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // eager 
  @ManyToOne(() => Board, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @Column()
  board_id: number;

  @Column({
    type: 'varchar',
    name: 'image_file_path',
    nullable: false,
    comment: '이모티콘 이미지 파일 경로',
  })
  image_file_path: string;

  @Column({
    type: 'varchar',
    name: 'image_file_name',
    nullable: false,
    comment: '이모티콘 이미지 파일 이름',
  })
  image_file_name: string;
}
