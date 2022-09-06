import { EntityRepository, Repository } from 'typeorm';
import { CreateNoticeDto } from '../dto/create-notice.dto';
import { StudioNotice } from '../entities/studio-notice.entity';

@EntityRepository(StudioNotice)
export class StudioNoticeRepository extends Repository<StudioNotice> {
  async createNotice(notice: CreateNoticeDto): Promise<void> {
    const studio_notice = this.create(notice);

    await this.save(studio_notice);
  }

  async findAllNotice(): Promise<StudioNotice[]> {
    return await this.find();
  }

  async findNotice(id: number): Promise<StudioNotice> {
    return await this.findOne({
      id,
    });
  }
}
