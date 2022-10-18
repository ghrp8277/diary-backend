import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMember } from 'src/auth/entities/user-member.entity';
import { EmojiConfirm } from 'src/store/entities/emoji-confirm.entity';
import { StoreGroupService } from 'src/store/service/store.group.service';
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
    private readonly storeGroupService: StoreGroupService,
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

  async findProductsByNew(
    username: string,
    page: number,
    size: number,
  ): Promise<Product[]> {
    return await this.productRepository.findProductsByNew(username, page, size);
  }

  async createProduct(emojiConfirm: EmojiConfirm): Promise<Product> {
    return await this.productRepository.createProductByEmojiConfirm(
      emojiConfirm,
    );
  }

  async createFavorite(product: Product): Promise<Favorite> {
    return await this.favoriteRepository.createFavorite(product);
  }

  async updateProductsByIsLike(
    username: string,
    id: number,
    is_like: boolean,
    page: number,
    size: number,
  ) {
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

      products = await this.productRepository.findProductsByNew(
        username,
        page,
        size,
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
  async findProductsByBest(page: number, size: number) {
    return await this.productRepository.findProductsByBest(page, size);
  }

  async findProductsByDetail(id: number, username: string) {
    return await this.productRepository.findProductsByDetail(id, username);
  }

  // 상품 스타일 태그 대로 가져오기
  async findProductsByStyle() {
    const arr = [];

    const group = await this.storeGroupService.findAllEmojiGroup();

    for (const item of group) {
      const id = item.id;
      const title = item.title;
      const bgColor = item.bg_color;
      const textColor = item.text_color;

      const groups = item.emojiGroupItems.map(async (item) => {
        const items = item.items;

        const result = [];

        for (const item of items) {
          await this.productRepository
            .findProductByStyle(item)
            .then((product) => {
              if (product) {
                const emoji_confirm = product.emojiConfirm;

                const emoji_info = emoji_confirm.emojiInfo;

                const image_files = emoji_confirm.imageFiles;

                result.push({
                  id: product.id,
                  count: product.count,
                  createdAt: emoji_confirm.createdAt,
                  product_name: emoji_info.product_name,
                  author_name: emoji_info.author_name,
                  title_image: image_files[0].image_url,
                });
              }
            });
        }

        return {
          id: item.id,
          title: item.title,
          result,
        };
      });

      // promise 값 처리
      const values = [];

      for (const item of groups) {
        const value = await item;

        if (value.result.length == 0) continue;

        values.push(value);
      }

      arr.push({
        id,
        title,
        bgColor,
        textColor,
        groups: values,
      });
    }

    // groups 빈값 체크 후 빈값일 경우 삭제
    for (let i = 0; i < arr.length; i++) {
      const groups = arr[i].groups;

      if (groups.length == 0) {
        arr.splice(i);
      }
    }

    return arr;
  }
}
