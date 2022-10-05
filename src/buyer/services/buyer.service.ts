import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMember } from 'src/auth/entities/user-member.entity';
import { EmojiConfirm } from 'src/store/entities/emoji-confirm.entity';
import { Connection } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { Product } from '../entities/product.entity';
import { FavoriteRepository } from '../repository/favorite.repository';
import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class BuyerService {
  constructor(
    private connection: Connection,
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
    @InjectRepository(FavoriteRepository)
    private readonly favoriteRepository: FavoriteRepository,
  ) {}

  async findProductsByName(
    product_name: string,
    page: number,
    size: number,
  ): Promise<{ product: Product[]; count: number }> {
    return await this.productRepository.findProductByName(
      product_name,
      page,
      size,
    );
  }

  async findAllProduct(username: string): Promise<Product[]> {
    return await this.productRepository.findAllProductByConfirm(username);
  }

  async createProduct(emojiConfirm: EmojiConfirm): Promise<Product> {
    return await this.productRepository.createProductByEmojiConfirm(
      emojiConfirm,
    );
  }

  async createFavorite(product: Product): Promise<Favorite> {
    return await this.favoriteRepository.createFavorite(product);
  }

  async updateProductByIsLike(username: string, id: number, is_like: boolean) {
    let products;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(UserMember, {
        username,
      });

      const product = await queryRunner.manager
        .createQueryBuilder(Product, 'product')
        .leftJoinAndSelect('product.favorite', 'favorite')
        .where('product.id = :id', { id })
        .andWhere('favorite.username = :username', { username: user.username })
        .select('product.id', 'id')
        .addSelect('product.count', 'count')
        .addSelect('favorite.id', 'favorite_id')
        .getRawOne();

      if (is_like && !product) {
        const product = await queryRunner.manager
          .createQueryBuilder(Product, 'product')
          .where('product.id = :id', { id })
          .select('product.id', 'id')
          .addSelect('product.count', 'count')
          .getRawOne();

        const favorite = queryRunner.manager.create(Favorite, {
          product,
          userMember: user,
        });

        await queryRunner.manager.save(favorite);

        await queryRunner.manager.update(Product, id, {
          count: product.count + 1,
        });
      } else {
        const id = product.id;

        const favorite_id = product.favorite_id;

        await queryRunner.manager.delete(Favorite, {
          id: favorite_id,
        });

        await queryRunner.manager.update(Product, id, {
          count: product.count - 1,
        });
      }

      await queryRunner.manager.createQueryBuilder(Product, 'product');

      products = await this.productRepository.findAllProductByConfirm(
        username,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error.message);

      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();

      if (products) return products;
      else
        throw new HttpException(
          'server error!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async findFavoritesByUsername(username: string) {
    return await this.favoriteRepository.findFavoritesByUsername(username);
  }

  // 카테고리 정보 가져오기
  async findProductByCategory() {
    return await this.productRepository.findProductByCategory();
  }

  // 상품 인기순위대로 가져오기
  async findProductByCount() {
    return await this.productRepository.findProductByCount();
  }
}
