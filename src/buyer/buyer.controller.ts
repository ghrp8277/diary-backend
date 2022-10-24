import {
  Body,
  Controller,
  Get,
  Param,
  Header,
  Post,
  Put,
  Query,
  Res,
  StreamableFile,
  Redirect,
} from '@nestjs/common';
import { Public } from 'src/auth/jwt/jwt.guard';
import { BuyerNoticeService } from './services/buyer.notice.service';
import { BuyerService } from './services/buyer.service';
import { Response as ExResponse } from 'express';
import { BuyerFAQService } from './services/buyer.faq.service';
import type { Response } from 'express';

@Public()
@Controller('buyer')
export class BuyerController {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly buyerNoticeService: BuyerNoticeService,
    private readonly buyerFAQService: BuyerFAQService,
  ) {}

  @Get('/download/file/:id')
  async getEmojiFile(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: number,
  ) {
    const file = await this.buyerService.getFileDownload(id);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="emoji.zip"',
    });

    return new StreamableFile(file);
  }

  // 검색창에 상품명 검색
  @Get('/search')
  async getProductsBySearch(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return await this.buyerService.findProductsByName(query, page, size);
  }

  // 신규 이모티콘 정보를 가져온다.
  @Get('/new/:username')
  async getEmojiFilesInfoByNew(
    @Param('username') username: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return await this.buyerService.findProductsByNew(username, page, size);
  }

  @Get('/style')
  async getProductsByStyle() {
    return await this.buyerService.findProductsByStyle();
  }

  @Get('/style/:id')
  async getProductByStyle(@Param('id') id: number) {
    return await this.buyerService.findProductByStyle(id);
  }

  // 신규 정보 카테고리
  @Get('/category')
  async getProductsCategory() {
    return await this.buyerService.findProductByCategory();
  }

  // 인기순위
  @Get('/rank')
  async getProductsByRank(
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return await this.buyerService.findProductsByBest(page, size);
  }

  // 디테일 페이지
  @Get('/detail/:username/products/:id')
  async getProductsByDetail(
    @Param('id') id: number,
    @Param('username') username: string,
  ) {
    return await this.buyerService.findProductsByDetail(id, username);
  }

  // 이모티콘 좋아요 누름
  @Put('/new/:username/products/:id')
  async updateProductsByIsLike(
    @Param('username') username: string,
    @Param('id') id: number,
    @Body('params') params: { is_like: boolean; page: number; size: number },
  ) {
    const { is_like, page, size } = params;

    return await this.buyerService.updateProductsByIsLike(
      username,
      id,
      is_like,
      page,
      size,
    );
  }

  // 즐겨찾기
  @Get('/favorite/:username')
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

    return res.render(path, function (err, html) {
      res.json({
        html,
        notice: {
          id: notice.id,
          is_important: notice.is_important,
          title: notice.title,
          createdAt: notice.createdAt,
        },
      });
    });
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
