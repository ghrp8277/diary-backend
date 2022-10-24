import { EntityRepository, Repository } from 'typeorm';
import { Amount } from '../entities/amount.entity';
import { CardInfo } from '../entities/card-info.entity';
import { PaymentHistory } from '../entities/payment-history.entity';
import { PaymentInfo } from '../entities/payment-info.entity';

@EntityRepository(PaymentInfo)
export class PaymentInfoRepository extends Repository<PaymentInfo> {
  async createPaymentInfo(
    payment_info: {
      aid: string;
      tid: string;
      cid: string;
      partner_order_id: string;
      partner_user_id: string;
      payment_method_type: string;
      item_name: string;
      quantity: number;
      created_at: string;
      approved_at: string;
      payload: string;
    },
    amount: Amount,
    card_info: CardInfo,
  ): Promise<PaymentInfo> {
    const {
      aid,
      tid,
      cid,
      partner_order_id,
      partner_user_id,
      payment_method_type,
      item_name,
      quantity,
      created_at,
      approved_at,
      payload,
    } = payment_info;

    const paymentInfo = this.create({
      aid,
      tid,
      cid,
      partner_order_id,
      partner_user_id,
      payment_method_type,
      item_name,
      quantity,
      created_at,
      approved_at,
      payload,
      cardInfo: card_info,
      amount,
    });

    return await this.save(paymentInfo);
  }
}
