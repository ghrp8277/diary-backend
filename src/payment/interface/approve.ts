import { AmountInterface } from './amount';
import { CardInfoInterface } from './cardInfo';

export interface ApproveInterface {
  aid: string;
  tid: string;
  cid: string;
  partner_order_id: string;
  partner_user_id: string;
  payment_method_type: string;
  item_name: string;
  quantity: number;
  amount: AmountInterface;
  card_info: CardInfoInterface;
  created_at: string;
  approved_at: string;
  payload: string;
}
