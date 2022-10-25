import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Amount } from './amount.entity';
import { CardInfo } from './card-info.entity';
import { PaymentHistory } from './payment-history.entity';

@Entity({ name: 'payment_info' })
export class PaymentInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Amount, (amount: Amount) => amount.paymentInfo, {
    cascade: true,
  })
  @JoinColumn({ name: 'amount_id', referencedColumnName: 'id' })
  amount: Amount;

  @OneToOne(() => CardInfo, (cardInfo: CardInfo) => cardInfo.paymentInfo, {
    cascade: true,
  })
  @JoinColumn({ name: 'card_info_id', referencedColumnName: 'id' })
  cardInfo: CardInfo;

  @OneToOne(
    () => PaymentHistory,
    (paymentHistory: PaymentHistory) => paymentHistory.paymentInfo,
    {
      onDelete: 'CASCADE',
    },
  )
  paymentHistory: PaymentHistory;

  @Column({
    name: 'aid',
    nullable: false,
    comment: '결제 일시',
    type: 'varchar',
  })
  aid: string;

  @Column({
    name: 'tid',
    nullable: false,
    comment: '결제 일시',
    type: 'varchar',
  })
  tid: string;

  @Column({
    name: 'cid',
    nullable: false,
    comment: '결제 일시',
    type: 'varchar',
  })
  cid: string;

  @Column({
    name: 'partner_order_id',
    nullable: false,
    comment: '결제 일시',
    type: 'varchar',
  })
  partner_order_id: string;

  @Column({
    name: 'partner_user_id',
    nullable: false,
    comment: '결제 일시',
    type: 'varchar',
  })
  partner_user_id: string;

  @Column({
    name: 'payment_method_type',
    nullable: false,
    comment: '결제 일시',
    type: 'varchar',
  })
  payment_method_type: string;

  @Column({
    name: 'item_name',
    nullable: false,
    comment: '결제 일시',
    type: 'varchar',
  })
  item_name: string;

  @Column({
    name: 'quantity',
    nullable: false,
    comment: '결제 일시',
  })
  quantity: number;

  @Column({
    name: 'created_at',
    nullable: false,
    comment: '결제 일시',
    type: 'varchar',
  })
  created_at: string;

  @Column({
    name: 'approved_at',
    nullable: false,
    comment: '결제 일시',
    type: 'varchar',
  })
  approved_at: string;

  @Column({
    name: 'payload',
    nullable: false,
    comment: '결제 일시',
    type: 'varchar',
  })
  payload: string;
}
