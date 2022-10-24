import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentHistoryRepository } from './repository/payment-history.repository';
import { PaymentInfoRepository } from './repository/payment-info.repository';
import { AmountRepository } from './repository/amount.repository';
import { CardInfoRepository } from './repository/card-info.repository';
import { AuthModule } from 'src/auth/auth.module';
import { BuyerModule } from 'src/buyer/buyer.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    AuthModule,
    BuyerModule,
    TypeOrmModule.forFeature([
      PaymentHistoryRepository,
      PaymentInfoRepository,
      CardInfoRepository,
      AmountRepository,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
