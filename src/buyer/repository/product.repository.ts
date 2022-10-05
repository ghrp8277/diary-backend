import { EmojiConfirm } from 'src/store/entities/emoji-confirm.entity';
import { EntityRepository, QueryRunner, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findAllProductByConfirm(
    username: string,
    queryRunner?: QueryRunner,
  ): Promise<Product[]> {
    const [products, favorites] = await Promise.all([
      this.createQueryBuilder('product', queryRunner)
        .leftJoinAndSelect('product.emojiConfirm', 'emojiConfirm')
        .leftJoinAndSelect('emojiConfirm.emojiInfo', 'emojiInfo')
        .leftJoinAndSelect('emojiConfirm.userMember', 'userMember')
        .leftJoinAndSelect('emojiConfirm.imageFiles', 'imageFiles')
        .where('emojiConfirm.is_confirm = :is_confirm', { is_confirm: '3' })
        .select([
          'product.id',
          'product.price',
          'product.count',
          'product.discount',
          'emojiConfirm.createdAt',
          'userMember.username',
          'emojiInfo.product_name',
          'emojiInfo.author_name',
          'emojiInfo.category',
          'emojiInfo.tag',
          'emojiInfo.comment',
          'imageFiles.image_url',
        ])
        .orderBy('product.id', 'DESC')
        .addOrderBy('emojiConfirm.createdAt', 'DESC')
        .getMany(),
      this.createQueryBuilder('product', queryRunner)
        .leftJoinAndSelect('product.favorite', 'favorite')
        .where('favorite.username = :username', { username })
        .select(['product.id'])
        .getMany(),
    ]);

    for (const favorite of favorites) {
      const id = favorite.id;

      const idx = products.findIndex((product) => product.id == id);

      products[idx]['is_like'] = true;
    }

    for (const product of products) {
      const is_like = product['is_like'];

      if (!is_like) product['is_like'] = false;
    }

    return products;
  }

  async createProductByEmojiConfirm(
    emojiCofirm: EmojiConfirm,
  ): Promise<Product> {
    const product = this.create({
      emojiConfirm: emojiCofirm,
    });

    return await this.save(product);
  }

  async findProductByCategory(): Promise<string[]> {
    const categories = await this.createQueryBuilder('product')
      .leftJoin('product.emojiConfirm', 'emojiConfirm')
      .innerJoin('emojiConfirm.emojiInfo', 'emojiInfo')
      .select('emojiInfo.category', 'category')
      .groupBy('emojiInfo.category')
      .having('COUNT(emojiInfo.category)')
      .orderBy('category', 'ASC')
      .getRawMany();

    return categories;
  }

  async findProductByCount(): Promise<Product[]> {
    const products = await this.createQueryBuilder('product')
      .innerJoin('product.emojiConfirm', 'emojiConfirm')
      .leftJoin('emojiConfirm.emojiInfo', 'emojiInfo')
      .leftJoin('emojiConfirm.imageFiles', 'imageFiles')
      .where('emojiConfirm.is_confirm = :is_confirm', { is_confirm: 4 })
      .select([
        'product.id',
        'product.count',
        'emojiConfirm.createdAt',
        'emojiInfo.product_name',
        'emojiInfo.author_name',
        'imageFiles.image_url',
      ])
      .orderBy('product.count', 'DESC')
      .addOrderBy('emojiConfirm.createdAt', 'DESC')
      .getMany();

    return products;
  }

  // 상품 검색 -> 이름으로 (좋아요 순위)
  async findProductByName(
    product_name: string,
    page: number,
    size: number,
  ): Promise<{ product: Product[]; count: number }> {
    const perPage = size;
    const skip = perPage * page - perPage;

    const [products, count] = await Promise.all([
      this.createQueryBuilder('product')
        .leftJoinAndSelect('product.emojiConfirm', 'emojiConfirm')
        .leftJoinAndSelect('emojiConfirm.emojiInfo', 'emojiInfo')
        .leftJoinAndSelect('emojiConfirm.userMember', 'userMember')
        .leftJoinAndSelect('emojiConfirm.imageFiles', 'imageFiles')
        .where('emojiInfo.product_name like :product_name', {
          product_name: `%${product_name}%`,
        })
        .andWhere('emojiConfirm.is_confirm = :is_confirm', { is_confirm: 4 })
        .select([
          'product.id',
          'product.price',
          'product.count',
          'product.discount',
          'emojiConfirm.createdAt',
          'userMember.username',
          'emojiInfo.product_name',
          'emojiInfo.author_name',
          'emojiInfo.category',
          'emojiInfo.tag',
          'emojiInfo.comment',
          'imageFiles.image_url',
        ])
        .orderBy('product.count', 'ASC')
        .limit(perPage)
        .offset(skip)
        .getMany(),
      this.createQueryBuilder('product')
        .leftJoinAndSelect('product.emojiConfirm', 'emojiConfirm')
        .leftJoinAndSelect('emojiConfirm.emojiInfo', 'emojiInfo')
        .where('emojiInfo.product_name like :product_name', {
          product_name: `%${product_name}%`,
        })
        .andWhere('emojiConfirm.is_confirm = :is_confirm', { is_confirm: 4 })
        .getCount(),
    ]);

    return {
      product: products,
      count,
    };
  }
}
