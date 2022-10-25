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
      .orderBy('payment_history.id', 'DESC')
      .getRawMany();
  }

  async findPaymentHistoryById(id: number): Promise<{
    payment_info_id: number;
    amount_id: number;
    card_info_id: number;
    cid: string;
    tid: string;
    total: number;
    tax_free: number;
  }> {
    return await this.createQueryBuilder('payment_history')
      .leftJoinAndSelect('payment_history.paymentInfo', 'payment_info')
      .leftJoinAndSelect('payment_info.cardInfo', 'card_info')
      .leftJoinAndSelect('payment_info.amount', 'amount')
      .where('payment_history.id = :id', { id })
      .select('payment_info.id', 'payment_info_id')
      .addSelect('amount.id', 'amount_id')
      .addSelect('card_info.id', 'card_info_id')
      .addSelect('payment_info.cid', 'cid')
      .addSelect('payment_info.tid', 'tid')
      .addSelect('amount.total', 'total')
      .addSelect('amount.tax_free', 'tax_free')
      .getRawOne();
  }

  async deletePaymentHistoryById(id: number) {
    return await this.delete({
      id,
    });
  }
}
