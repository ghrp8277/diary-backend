import { PaymentHistory } from 'src/payment/entities/payment-history.entity';
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

  @OneToOne(
    () => EmojiConfirm,
    (emojiConfirm: EmojiConfirm) => emojiConfirm.product,
  )
  @JoinColumn({ name: 'emoji_confirm_id', referencedColumnName: 'id' })
  emojiConfirm: EmojiConfirm;

  @OneToOne(() => Favorite, (favorite: Favorite) => favorite.product)
  favorite: Favorite;

  @Column({
    name: 'count',
    nullable: false,
    default: 0,
    comment: '인기도',
    type: 'int',
  })
  count: number;

  @Column({
    name: 'price',
    nullable: false,
    default: 1500,
    comment: '가격',
    type: 'int',
  })
  price: number;

  @Column({
    name: 'discount',
    nullable: false,
    default: 0,
    comment: '할인율',
  })
  discount: number;
}
