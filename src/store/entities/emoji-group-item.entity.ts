import { Product } from 'src/buyer/entities/product.entity';
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
import { EmojiGroup } from './emoji-group.entity';

@Entity({ name: 'emoji_group_item' })
export class EmojiGroupItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => EmojiGroup,
    (emojiGroup: EmojiGroup) => emojiGroup.emojiGroupItems,
  )
  @JoinColumn({ name: 'emoji_group_id', referencedColumnName: 'id' })
  emojiGroup: EmojiGroup;

  @Column({
    name: 'title',
    nullable: false,
    comment: '그룹 아이템 타이틀',
    type: 'varchar',
    unique: true,
  })
  title: string;

  @Column({
    name: 'items',
    nullable: false,
    type: 'simple-array',
    array: true,
    // comment: '그룹 아이템 이미지리스트',
  })
  items: number[];
}
