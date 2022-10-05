import { EntityRepository, Repository } from 'typeorm';
import { CreateNoticeDto } from '../dto/create-notice.dto';
import { StudioNotice } from '../entities/studio-notice.entity';

@EntityRepository(StudioNotice)
export class StudioNoticeRepository extends Repository<StudioNotice> {
  async createNotice(notice: CreateNoticeDto): Promise<void> {
    const studio_notice = this.create(notice);

    await this.save(studio_notice);
  }

  async findNoticeByPage(page: number): Promise<{
    notices: StudioNotice[];
    totalPage: number;
  }> {
    const perPage = 5;
    const skip = perPage * page - perPage;

    const [important_list, list, cnt] = await Promise.all([
      // skip - 엔티티를 가져와야 하는 위치에서 offset
      // take - limit (paginated) - 가져와야 하는 최대 엔티티 수
      this.find({
        where: {
          is_visible: true,
          is_important: true,
        },
        order: {
          createdAt: 'ASC',
        },
      }),
      this.find({
        where: {
          is_visible: true,
          is_important: false,
        },
        take: perPage,
        skip: skip,
        order: {
          // is_important: 'DESC',
          createdAt: 'ASC',
        },
      }),
      this.count({
        where: {
          is_important: false,
        },
      }),
    ]);

    const totalPage = Math.ceil(cnt / perPage);

    return {
      notices: important_list.concat(list),
      totalPage,
    };
  }

  async findNotice(id: number): Promise<StudioNotice> {
    return await this.findOne({
      id,
    });
  }
}
