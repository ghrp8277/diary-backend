import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BuyerNoticeRepository } from '../repository/buyer-notice.repository';
import { BuyerNotice } from '../entities/buyer-notice.entity';

Injectable();
export class BuyerNoticeService {
  constructor(
    @InjectRepository(BuyerNoticeRepository)
    private readonly buyerNoticeRepository: BuyerNoticeRepository,
  ) {}

  async createNotice(notice: {
    is_important: boolean;
    title: string;
    file_name: string;
    username: string;
  }): Promise<void> {
    await this.buyerNoticeRepository.createNotice(notice);
  }

  async findNoticeByPage(page: number): Promise<{
    notices: BuyerNotice[];
    totalPage: number;
  }> {
    return await this.buyerNoticeRepository.findNoticeByPage(page);
  }

  async findNotice(id: number): Promise<BuyerNotice> {
    return await this.buyerNoticeRepository.findNotice(id);
  }
}
