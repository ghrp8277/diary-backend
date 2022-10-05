import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoticeDto } from '../dto/create-notice.dto';
import { StudioNotice } from '../entities/studio-notice.entity';
import { StudioNoticeRepository } from '../repository/studio-notice.repository';

Injectable();
export class StoreNoticeService {
  constructor(
    @InjectRepository(StudioNoticeRepository)
    private readonly studioNoticeRepository: StudioNoticeRepository,
  ) {}

  async createNotice(notice: CreateNoticeDto): Promise<void> {
    await this.studioNoticeRepository.createNotice(notice);
  }

  async findNoticeByPage(page: number): Promise<{
    notices: StudioNotice[];
    totalPage: number;
  }> {
    return await this.studioNoticeRepository.findNoticeByPage(page);
  }

  async findNotice(id: number): Promise<StudioNotice> {
    return await this.studioNoticeRepository.findNotice(id);
  }
}
