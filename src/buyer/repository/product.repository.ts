import { EmojiConfirm } from 'src/store/entities/emoji-confirm.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    async findAllProductByConfirm(): Promise<Product[]> {
        return await this.createQueryBuilder('product')
        .leftJoinAndSelect('product.emojiConfirm', 'emojiConfirm')
        .leftJoinAndSelect('emojiConfirm.emojiInfo', 'emojiInfo')
        .leftJoinAndSelect('emojiConfirm.userMember', 'userMember')
        .leftJoinAndSelect('emojiConfirm.imageFiles', 'imageFiles')
        .where('emojiConfirm.is_confirm = :is_confirm', { is_confirm: '0' })
        .select([
            'product.id',
            'emojiConfirm.createdAt',
            'userMember.username',
            'emojiInfo.product_name',
            'emojiInfo.author_name',
            'emojiInfo.category',
            'emojiInfo.tag',
            'emojiInfo.comment',
            'imageFiles.image_url'
        ])
        .orderBy('emojiConfirm.createdAt', 'DESC')
        .getMany()
    }

    async createProductByEmojiConfirm(emojiCofirm: EmojiConfirm): Promise<void> {
        const product = this.create({
            emojiConfirm: emojiCofirm
        })

        await this.save(product);
    }
}