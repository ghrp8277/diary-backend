export interface OrderInterface {
  tid: string;
  cid: string;
  status: string;
  partner_order_id: string;
  partner_user_id: string;
  payment_method_type: string;
  item_name: string;
  quantity: number;
  amount: {
    total: number;
    tax_free: number;
    vat: number;
    point: number;
    discount: number;
    green_deposit: number;
  };
  canceled_amount: {
    total: number;
    tax_free: number;
    vat: number;
    point: number;
    discount: number;
    green_deposit: number;
  };
  cancel_available_amount: {
    total: number;
    tax_free: number;
    vat: number;
    point: number;
    discount: number;
    green_deposit: number;
  };
  created_at: string;
  approved_at: string;
  payment_action_details: [
    {
      aid: string;
      payment_action_type: string;
      payment_method_type: string;
      amount: number;
      point_amount: number;
      discount_amount: number;
      approved_at: string;
      green_deposit: number;
    },
  ];
}
