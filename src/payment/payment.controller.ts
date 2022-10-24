import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/jwt/jwt.guard';
import { PaymentService } from './services/payment.service';

@Public()
@Controller('payment')
export class PaymentController {
  constructor(private readonly buyerService: PaymentService) {}
  @Post('/ready')
  async payment(@Body('form_data') form_data: string) {
    const json = JSON.parse(form_data);

    return await this.buyerService.kakaoPayment(json);
  }

  @Post('/approve/:username')
  async approve(
    @Param('username') username: string,
    @Body('form_data') form_data: string,
  ) {
    const json = JSON.parse(form_data);

    return await this.buyerService.paymentApproveToSave(username, json);
  }

  @Get('/history/:username')
  async getAllPaymentHistory(@Param('username') username: string) {
    return await this.buyerService.findAllPaymentHistoryByUsername(username);
  }
}
