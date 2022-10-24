import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { PaymentHistoryRepository } from '../repository/payment-history.repository';
import { PaymentInfoRepository } from '../repository/payment-info.repository';
import { AmountRepository } from '../repository/amount.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CardInfoRepository } from '../repository/card-info.repository';
import { AuthService } from 'src/auth/auth.service';
import { ApproveInterface } from '../interface/approve';
import { PaymentInterface } from '../interface/payment';
import { BuyerService } from 'src/buyer/services/buyer.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentHistoryRepository)
    private readonly paymentHistoryRepository: PaymentHistoryRepository,
    @InjectRepository(PaymentInfoRepository)
    private readonly paymentInfoRepository: PaymentInfoRepository,
    @InjectRepository(AmountRepository)
    private readonly amountRepository: AmountRepository,
    @InjectRepository(CardInfoRepository)
    private readonly cardInfoRepository: CardInfoRepository,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
    private readonly buyerService: BuyerService,
  ) {}

  async kakaoPayment(formData: {
    partner_order_id: string;
    quantity: number;
    total_amount: number;
  }): Promise<PaymentInterface> {
    const { partner_order_id, quantity, total_amount } = formData;

    const url = 'https://kapi.kakao.com';

    const APP_ADMIN_KEY = '0249122023710646375b960590585b33';

    const headers = {
      Authorization: `KakaoAK ${APP_ADMIN_KEY}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    const params = {
      // 가맹점 코드 인증키, 24자, 숫자와 영문 소문자 조합
      cid: 'TC0ONETIME',
      // 가맹점 주문번호, 최대 100자
      partner_order_id,
      // 가맹점 회원 id, 최대 100자
      partner_user_id: 'diary-studio',
      // 상품명, 최대 100자
      item_name: '이모티콘',
      // 상품 수량
      quantity,
      // 상품 총액
      total_amount,
      // 상품 비과세 금액
      tax_free_amount: 0,
      // 결제 성공 시 redirect url, 최대 255자
      approval_url: 'http://localhost:3000',
      // 결제 취소 시 redirect url, 최대 255자
      fail_url: 'http://localhost:3000',
      // 결제 실패 시 redirect url, 최대 255자
      cancel_url: 'http://localhost:3000',
    };

    const requestConfig: AxiosRequestConfig = {
      headers,
      params,
    };

    const response = await firstValueFrom(
      this.httpService.post(`${url}/v1/payment/ready`, null, requestConfig),
    );

    return response.data;
  }

  async kakaoApprove(formData: {
    tid: string;
    partner_order_id: string;
    pg_token: string;
    total_amount: number;
  }): Promise<ApproveInterface> {
    const { tid, partner_order_id, pg_token, total_amount } = formData;
    const url = 'https://kapi.kakao.com';

    const APP_ADMIN_KEY = '0249122023710646375b960590585b33';

    const headers = {
      Authorization: `KakaoAK ${APP_ADMIN_KEY}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    const params = {
      // 가맹점 코드 인증키, 24자, 숫자와 영문 소문자 조합
      cid: 'TC0ONETIME',
      // 결제 고유번호, 결제 준비 API 응답에 포함
      tid,
      // 가맹점 주문번호, 결제 준비 API 요청과 일치해야 함
      partner_order_id,
      // 가맹점 회원 id, 결제 준비 API 요청과 일치해야 함
      partner_user_id: 'diary-studio',
      // 결제승인 요청을 인증하는 토큰 사용자 결제 수단 선택 완료 시,
      // approval_url로 redirection해줄 때 pg_token을 query string으로 전달
      pg_token,
      // 결제 승인 요청에 대해 저장하고 싶은 값, 최대 200자
      payload: '결제 완료',
      // 상품 총액, 결제 준비 API 요청과 일치해야 함
      total_amount,
    };

    const requestConfig: AxiosRequestConfig = {
      headers,
      params,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${url}/v1/payment/approve`, null, requestConfig),
      );

      return response.data as ApproveInterface;
    } catch (error) {
      console.log(error);
      new HttpException(error.messsage, error.status);
    }
  }

  async paymentApproveToSave(
    username: string,
    formData: {
      tid: string;
      partner_order_id: string;
      pg_token: string;
      total_amount: number;
    },
  ) {
    try {
      const user_member = await this.authService.findUserByUsername(username);

      const data = await this.kakaoApprove(formData);

      const payment = {
        aid: data.aid,
        tid: data.tid,
        cid: data.cid,
        partner_order_id: data.partner_order_id,
        partner_user_id: data.partner_user_id,
        payment_method_type: data.payment_method_type,
        item_name: data.item_name,
        quantity: data.quantity,
        created_at: data.created_at,
        approved_at: data.approved_at,
        payload: data.payload,
      };

      const amount = await this.amountRepository.createAmount(data.amount);

      let card_info;

      if (data.card_info) {
        card_info = await this.cardInfoRepository.createCardInfo(
          data.card_info,
        );
      }

      const payment_info = await this.paymentInfoRepository.createPaymentInfo(
        payment,
        amount,
        card_info,
      );

      await this.paymentHistoryRepository.createPaymentHistory(
        user_member,
        payment_info,
      );

      return true;
    } catch (error) {
      console.log(error);
      new HttpException(error.messsage, error.status);
    }
  }

  async findAllPaymentHistoryByUsername(username: string) {
    const histories =
      await this.paymentHistoryRepository.findAllPaymentHistoryByUsername(
        username,
      );

    for (const history of histories) {
      const card_info = history.card_info;
      const id = Number(history.product_id);
      switch (card_info) {
        case 'MONEY':
          history.card_info = '현금결제';
          break;
        case 'CARD':
          history.card_info = '신용카드';
          break;
      }

      delete history.product_id;

      const product = await this.buyerService.findProductById(id);

      history['product'] = {
        id,
        product_name: product.product_name,
        author_name: product.author_name,
        title_image: product.imageFiles_image_url,
      };
    }

    return histories;
  }
}
