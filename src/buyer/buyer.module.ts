import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './repository/product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRepository,
    ]),
  ],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [BuyerService]
})
export class BuyerModule {}
