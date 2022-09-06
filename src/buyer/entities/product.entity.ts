import { EmojiConfirm } from 'src/store/entities/emoji-confirm.entity';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Favorite } from './favorite.entity';

  @Entity({ name: 'product' })
  export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => EmojiConfirm, (emojiConfirm: EmojiConfirm) => emojiConfirm.product)
    @JoinColumn({ name: 'emoji_confirm_id', referencedColumnName: 'id' })
    emojiConfirm: EmojiConfirm;

    @OneToOne(() => Favorite, (favorite: Favorite) => favorite.product)
    favorite: Favorite;
  }
  