import { Favorite } from '../entities/favorite.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@EntityRepository(Favorite)
export class FavoriteRepository extends Repository<Favorite> {
  async createFavorite(product: Product): Promise<Favorite> {
    const favorite = this.create({
      product,
    });

    return await this.save(favorite);
  }

  async findFavoritesByUsername(username: string) {
    const favorites = await this.createQueryBuilder('favorite')
      .innerJoin('favorite.product', 'product')
      .leftJoinAndSelect('product.emojiConfirm', 'emojiConfirm')
      .leftJoinAndSelect('emojiConfirm.imageFiles', 'imageFiles')
      .leftJoinAndSelect('emojiConfirm.userMember', 'userMember')
      .leftJoinAndSelect('emojiConfirm.emojiInfo', 'emojiInfo')
      .where('favorite.username = :username', { username })
      .select([
        'favorite.id',
        'product.id',
        'product.count',
        'emojiConfirm.createdAt',
        'emojiInfo.product_name',
        'emojiInfo.author_name',
        'imageFiles.image_url',
      ])
      .getMany();

    return favorites;
  }
}
