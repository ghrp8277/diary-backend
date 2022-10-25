import { EntityRepository, Repository } from 'typeorm';
import { Amount } from '../entities/amount.entity';
import { CardInfo } from '../entities/card-info.entity';
import { CardInfoInterface } from '../interface/cardInfo';

@EntityRepository(CardInfo)
export class CardInfoRepository extends Repository<CardInfo> {
  async createCardInfo(card_info: CardInfoInterface): Promise<CardInfo> {
    try {
      const {
        interest_free_install,
        bin,
        card_type,
        card_mid,
        approved_id,
        install_month,
        purchase_corp,
        purchase_corp_code,
        issuer_corp,
        issuer_corp_code,
        card_item_code,
        kakaopay_purchase_corp,
        kakaopay_purchase_corp_code,
        kakaopay_issuer_corp,
        kakaopay_issuer_corp_code,
      } = card_info;

      const card = this.create({
        interest_free_install,
        bin,
        card_type,
        card_mid,
        approved_id,
        install_month,
        purchase_corp,
        purchase_corp_code,
        issuer_corp,
        issuer_corp_code,
        card_item_code,
        kakaopay_purchase_corp,
        kakaopay_purchase_corp_code,
        kakaopay_issuer_corp,
        kakaopay_issuer_corp_code,
      });

      return await this.save(card);
    } catch (error) {
      console.log(error);
      new Error(error.messsage);
    }
  }

  async deleteCardInfoById(id: number) {
    await this.delete({
      id,
    });
  }
}
