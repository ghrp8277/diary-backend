import { EmojiConfirm } from 'src/store/entities/emoji-confirm.entity';
import { EntityRepository, QueryRunner, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async findCategoryByTags(category: string) {
    const products = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.emojiConfirm', 'emojiConfirm')
      .leftJoinAndSelect('emojiConfirm.emojiInfo', 'emojiInfo')
      .leftJoinAndSelect('emojiConfirm.userMember', 'userMember')
      .leftJoinAndSelect('emojiConfirm.imageFiles', 'imageFiles')
      .where('emojiConfirm.is_confirm = :is_confirm', { is_confirm: '3' })
      .andWhere('emojiInfo.category = :category', { category })
      .select([
        'product.id',
        'emojiConfirm.createdAt',
        'emojiInfo.tag',
        'imageFiles.image_url',
      ])
      .distinctOn(['emojiInfo.tag'])
      .orderBy('product.id', 'DESC')
      .addOrderBy('emojiConfirm.createdAt', 'DESC')
      .limit(9)
      .getMany();

    return products;
  }

  async findProductsByNew(
    username: string,
    page: number,
    size: number,
    queryRunner?: QueryRunner,
  ): Promise<Product[]> {
    const perPage = size;
    const skip = perPage * page - perPage;

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
        .limit(perPage)
        .offset(skip)
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
      .where('emojiConfirm.is_confirm = :is_confirm', { is_confirm: 4 })
      .select('emojiInfo.category', 'category')
      .groupBy('emojiInfo.category')
      .having('COUNT(emojiInfo.category)')
      .orderBy('category', 'ASC')
      .getRawMany();

    return categories;
  }

  async findProductsByBest(page: number, size: number): Promise<Product[]> {
    const perPage = size;
    const skip = perPage * page - perPage;

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
      .limit(perPage)
      .offset(skip)
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

  async findProductsByDetail(id: number, username: string) {
    const [product, favorite, check] = await Promise.all([
      this.createQueryBuilder('product')
        .innerJoin('product.emojiConfirm', 'emojiConfirm')
        .leftJoin('emojiConfirm.emojiInfo', 'emojiInfo')
        .leftJoin('emojiConfirm.imageFiles', 'imageFiles')
        .where('emojiConfirm.is_confirm = :is_confirm', { is_confirm: 4 })
        .andWhere('product.id = :id', { id })
        .select([
          'product.id',
          'product.count',
          'product.price',
          'emojiConfirm.createdAt',
          'emojiInfo.product_name',
          'emojiInfo.author_name',
          'imageFiles.image_url',
        ])
        .orderBy('product.count', 'DESC')
        .addOrderBy('emojiConfirm.createdAt', 'DESC')
        .getOne(),
      this.createQueryBuilder('product')
        .leftJoinAndSelect('product.favorite', 'favorite')
        .where('favorite.username = :username', { username })
        .andWhere('product.id = :id', { id })
        .getOne(),
      this.createQueryBuilder('product')
        .innerJoin('product.emojiConfirm', 'emojiConfirm')
        .leftJoin('emojiConfirm.userMember', 'userMember')
        .leftJoin('userMember.paymentHistories', 'paymentHistories')
        .leftJoin('paymentHistories.paymentInfo', 'paymentInfo')
        .where('paymentInfo.partner_order_id = :partner_order_id', {
          partner_order_id: String(id),
        })
        .select('product.id', 'id')
        .getRawOne(),
    ]);

    if (favorite) {
      product['is_like'] = true;
    } else {
      product['is_like'] = false;
    }

    if (check) {
      product['is_buyer'] = true;
    } else {
      product['is_buyer'] = false;
    }

    return product;
  }

  async findProductByStyle(id: number): Promise<Product> {
    const product = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.emojiConfirm', 'emojiConfirm')
      .leftJoinAndSelect('emojiConfirm.emojiInfo', 'emojiInfo')
      .leftJoinAndSelect('emojiConfirm.imageFiles', 'imageFiles')
      .where('product.id = :id', { id })
      .andWhere('emojiConfirm.is_confirm = :is_confirm', { is_confirm: 4 })
      .select([
        'product.id',
        'product.count',
        'emojiConfirm.createdAt',
        'emojiInfo.product_name',
        'emojiInfo.author_name',
        'imageFiles.image_url',
      ])
      .getOne();

    return product;
  }

  // 파일 다운로드
  async fileDownloadByProductId(id: number): Promise<{
    id: number;
    file_path: string;
  }> {
    const product = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.emojiConfirm', 'emojiConfirm')
      .leftJoinAndSelect('emojiConfirm.imageFiles', 'imageFiles')
      .where('product.id = :id', { id })
      .select('imageFiles.file_path', 'file_path')
      .getRawOne();

    return product;
  }

  async findProductById(id: number): Promise<any> {
    const product = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.emojiConfirm', 'emojiConfirm')
      .leftJoinAndSelect('emojiConfirm.emojiInfo', 'emojiInfo')
      .leftJoinAndSelect('emojiConfirm.imageFiles', 'imageFiles')
      .where('product.id = :id', { id })
      .select('emojiInfo.product_name', 'product_name')
      .addSelect('emojiInfo.author_name', 'author_name')
      .addSelect('imageFiles', 'image_files')
      .getRawOne();

    return product;
  }
}
