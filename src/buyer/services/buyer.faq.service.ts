import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BuyerFAQRepository } from '../repository/buyer-faq.repository';
import { BuyerFAQ } from '../entities/buyer-faq.entity';

Injectable();
export class BuyerFAQService {
  constructor(
    @InjectRepository(BuyerFAQRepository)
    private readonly buyerFAQRepository: BuyerFAQRepository,
  ) {}
  async findAllFAQ(): Promise<BuyerFAQ[]> {
    return await this.buyerFAQRepository.findAllFAQ();
  }
}
