import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentInfo } from './payment-info.entity';

@Entity({ name: 'amount' })
export class Amount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => PaymentInfo, (paymentInfo: PaymentInfo) => paymentInfo.amount)
  paymentInfo: PaymentInfo;

  @Column({
    name: 'total',
    nullable: false,
    comment: '전체 결제 금액',
  })
  total: number;

  @Column({
    name: 'tax_free',
    nullable: false,
    comment: '비과세 금액',
  })
  tax_free: number;

  @Column({
    name: 'vat',
    nullable: false,
    comment: '부가세 금액',
  })
  vat: number;

  @Column({
    name: 'point',
    nullable: false,
    comment: '사용한 포인트 금액',
  })
  point: number;

  @Column({
    name: 'discount',
    nullable: false,
    comment: '할인 금액',
  })
  discount: number;

  @Column({
    name: 'green_deposit',
    nullable: false,
    comment: '컵 보증금',
  })
  green_deposit: number;
}
