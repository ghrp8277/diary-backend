import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './services/buyer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './repository/product.repository';
import { FavoriteRepository } from './repository/favorite.repository';
import { BuyerNoticeService } from './services/buyer.notice.service';
import { BuyerNoticeRepository } from './repository/buyer-notice.repository';
import { BuyerFAQService } from './services/buyer.faq.service';
import { BuyerFAQRepository } from './repository/buyer-faq.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRepository,
      FavoriteRepository,
      BuyerNoticeRepository,
      BuyerFAQRepository,
    ]),
  ],
  controllers: [BuyerController],
  providers: [BuyerService, BuyerNoticeService, BuyerFAQService],
  exports: [BuyerService],
})
export class BuyerModule {}
