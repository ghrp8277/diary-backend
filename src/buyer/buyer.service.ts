import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmojiConfirm } from 'src/store/entities/emoji-confirm.entity';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repository/product.repository';

@Injectable()
export class BuyerService {
    constructor(
        @InjectRepository(ProductRepository)
        private readonly productRepository: ProductRepository
    ) {}

    async findAllProduct(): Promise<Product[]> {
        return await this.productRepository.findAllProductByConfirm() 
    }

    async createProduct(emojiConfirm: EmojiConfirm): Promise<void> {
        await this.productRepository.createProductByEmojiConfirm(emojiConfirm)
    }
}
