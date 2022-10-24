import { UserMember } from 'src/auth/entities/user-member.entity';
import { EntityRepository, Repository } from 'typeorm';
import { PaymentHistory } from '../entities/payment-history.entity';
import { PaymentInfo } from '../entities/payment-info.entity';

@EntityRepository(PaymentHistory)
export class PaymentHistoryRepository extends Repository<PaymentHistory> {
  async createPaymentHistory(
    user_member: UserMember,
    payment_info: PaymentInfo,
  ): Promise<void> {
    const paymentHistory = this.create({
      userMember: user_member,
      paymentInfo: payment_info,
    });

    await this.save(paymentHistory);
  }

  async findAllPaymentHistoryByUsername(username: string): Promise<
    {
      id: number;
      createdAt: string;
      card_info: string;
      price: number;
      product_id: string;
    }[]
  > {
    return await this.createQueryBuilder('payment_history')
      .leftJoinAndSelect('payment_history.userMember', 'user_member')
      .leftJoinAndSelect('payment_history.paymentInfo', 'payment_info')
      .leftJoinAndSelect('payment_info.cardInfo', 'card_info')
      .leftJoinAndSelect('payment_info.amount', 'amount')
      .where('user_member.username = :username', { username })
      .select('payment_info.created_at', 'createdAt')
      .addSelect('payment_info.payment_method_type', 'card_info')
      .addSelect('amount.total', 'price')
      .addSelect('payment_info.partner_order_id', 'product_id')
      .addSelect('payment_history.id', 'id')
      .getRawMany();
  }
}
