import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Public } from 'src/auth/jwt/jwt.guard';
import { BuyerNoticeService } from './services/buyer.notice.service';
import { BuyerService } from './services/buyer.service';
import { Response as ExResponse } from 'express';
import { BuyerFAQService } from './services/buyer.faq.service';

@Public()
@Controller('buyer')
export class BuyerController {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly buyerNoticeService: BuyerNoticeService,
    private readonly buyerFAQService: BuyerFAQService,
  ) {}

  // 검색창에 상품명 검색
  @Get('/products/search')
  async getProductsBySearch(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return await this.buyerService.findProductsByName(query, page, size);
  }

  @Get('/:username/products')
  async getEmojiFilesInfo(@Param('username') username: string) {
    return await this.buyerService.findAllProduct(username);
  }

  @Get('/products/category')
  async getProductsCategory() {
    return await this.buyerService.findProductByCategory();
  }

  // 인기순위
  @Get('/products/rank')
  async getProductsByRank() {
    return await this.buyerService.findProductByCount();
  }

  // 이모티콘 좋아요 누름
  @Patch('/:username/products/:id')
  async updateProductByIsLike(
    @Param('username') username: string,
    @Param('id') id: number,
    @Body('params') params: { is_like: boolean },
  ) {
    const is_like = params.is_like;

    // 1. is_like update
    return await this.buyerService.updateProductByIsLike(username, id, is_like);
  }

  // 즐겨찾기
  @Get('/:username/products/favorite')
  async getFavoritesInfo(@Param('username') username: string) {
    return await this.buyerService.findFavoritesByUsername(username);
  }

  // 공지사항 전체 정보를 가져온다.
  @Get('/:page/notices')
  async getAllNotice(@Param('page') page: number) {
    return await this.buyerNoticeService.findNoticeByPage(page);
  }

  // 공지사항 내용을 가져온다.
  @Get('/notices/:id')
  async getNotice(@Res() res: ExResponse, @Param('id') id: number) {
    const notice = await this.buyerNoticeService.findNotice(id);

    const path = `buyer/${notice.file_name}`;

    return res.render(path);
  }

  // 공지사항 내용을 생성한다.
  @Post('/:username/notice')
  async createNotice(
    @Param('username') username: string,
    @Body()
    notice: {
      is_important: boolean;
      title: string;
      file_name: string;
      username: string;
    },
  ) {
    return await this.buyerNoticeService.createNotice(notice);
  }

  // faq 전체 정보를 가져온다.
  @Get('/faq')
  async getAllFAQ() {
    return await this.buyerFAQService.findAllFAQ();
  }
}
