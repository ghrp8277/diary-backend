import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentInfo } from './payment-info.entity';

@Entity({ name: 'card_info' })
export class CardInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    () => PaymentInfo,
    (paymentInfo: PaymentInfo) => paymentInfo.cardInfo,
    {
      onDelete: 'CASCADE',
    },
  )
  paymentInfo: PaymentInfo;

  @Column({
    name: 'purchase_corp',
    nullable: false,
    comment: '매입 카드사 한글명',
    type: 'varchar',
  })
  purchase_corp: string;

  @Column({
    name: 'purchase_corp_code',
    nullable: false,
    comment: '매입 카드사 코드',
    type: 'varchar',
  })
  purchase_corp_code: string;

  @Column({
    name: 'issuer_corp',
    nullable: false,
    comment: '카드 발급사 한글명',
    type: 'varchar',
  })
  issuer_corp: string;

  @Column({
    name: 'issuer_corp_code',
    nullable: false,
    comment: '카드 발급사 코드',
    type: 'varchar',
  })
  issuer_corp_code: string;

  @Column({
    name: 'kakaopay_purchase_corp',
    nullable: false,
    comment: '카카오페이 매입사명',
    type: 'varchar',
  })
  kakaopay_purchase_corp: string;

  @Column({
    name: 'kakaopay_purchase_corp_code',
    nullable: false,
    comment: '카카오페이 매입사 코드',
    type: 'varchar',
  })
  kakaopay_purchase_corp_code: string;

  @Column({
    name: 'kakaopay_issuer_corp',
    nullable: false,
    comment: '카카오페이 발급사명',
    type: 'varchar',
  })
  kakaopay_issuer_corp: string;

  @Column({
    name: 'kakaopay_issuer_corp_code',
    nullable: false,
    comment: '카카오페이 발급사 코드',
    type: 'varchar',
  })
  kakaopay_issuer_corp_code: string;

  @Column({
    name: 'bin',
    nullable: false,
    comment: '카드 BIN',
    type: 'varchar',
  })
  bin: string;

  @Column({
    name: 'card_type',
    nullable: false,
    comment: '카드 타입',
    type: 'varchar',
  })
  card_type: string;

  @Column({
    name: 'install_month',
    nullable: false,
    comment: '할부 개월 수',
    type: 'varchar',
  })
  install_month: string;

  @Column({
    name: 'approved_id',
    nullable: false,
    comment: '카드사 승인번호',
    type: 'varchar',
  })
  approved_id: string;

  @Column({
    name: 'card_mid',
    nullable: false,
    comment: '카드사 가맹점 번호',
    type: 'varchar',
  })
  card_mid: string;

  @Column({
    name: 'interest_free_install',
    nullable: false,
    comment: '무이자할부 여부(Y/N)',
    type: 'varchar',
  })
  interest_free_install: string;

  @Column({
    name: 'card_item_code',
    nullable: false,
    comment: '카드 상품 코드',
    type: 'varchar',
  })
  card_item_code: string;
}
