import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmojiGroupItem } from './emoji-group-item.entity';
import { EmojiInfo } from './emoji-info.entity';

@Entity({ name: 'emoji_group' })
export class EmojiGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => EmojiGroupItem,
    (emojiGroupItem: EmojiGroupItem) => emojiGroupItem.emojiGroup,
  )
  emojiGroupItems: EmojiGroupItem[];

  @Column({
    name: 'bg_color',
    nullable: false,
    comment: '그룹 색상',
    type: 'varchar',
  })
  bg_color: string;

  @Column({
    name: 'text_color',
    nullable: false,
    comment: '그룹 타이틀 색상',
    type: 'varchar',
  })
  text_color: string;

  @Column({
    name: 'title',
    nullable: false,
    comment: '그룹 타이틀',
    type: 'varchar',
    unique: true,
  })
  title: string;

  @Column({
    name: 'match_title',
    nullable: false,
    comment: '그룹 매칭 타이틀',
    type: 'varchar',
    unique: true,
  })
  match_title: string;
}
