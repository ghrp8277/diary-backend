import { EntityRepository, Repository } from 'typeorm';
import { BuyerFAQ } from '../entities/buyer-faq.entity';

@EntityRepository(BuyerFAQ)
export class BuyerFAQRepository extends Repository<BuyerFAQ> {
  async findAllFAQ(): Promise<BuyerFAQ[]> {
    return await this.find({
      where: {
        is_visible: true,
      },
    });
  }
}
