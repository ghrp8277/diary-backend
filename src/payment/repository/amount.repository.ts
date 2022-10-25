import { EntityRepository, Repository } from 'typeorm';
import { Amount } from '../entities/amount.entity';
import { AmountInterface } from '../interface/amount';

@EntityRepository(Amount)
export class AmountRepository extends Repository<Amount> {
  async createAmount(amount: AmountInterface): Promise<Amount> {
    const { total, tax_free, vat, point, discount, green_deposit } = amount;

    const amount_info = this.create({
      total,
      tax_free,
      vat,
      point,
      discount,
      green_deposit,
    });

    return await this.save(amount_info);
  }

  async deleteAmountById(id: number) {
    await this.delete({
      id,
    });
  }
}
