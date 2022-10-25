import { UserMember } from 'src/auth/entities/user-member.entity';
import { Product } from 'src/buyer/entities/product.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentInfo } from './payment-info.entity';

@Entity({ name: 'payment_history' })
export class PaymentHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    () => PaymentInfo,
    (paymentInfo: PaymentInfo) => paymentInfo.paymentHistory,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'payment_info_id', referencedColumnName: 'id' })
  paymentInfo: PaymentInfo;

  @ManyToOne(() => UserMember, (user: UserMember) => user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_member_id', referencedColumnName: 'id' })
  userMember: UserMember;
}
