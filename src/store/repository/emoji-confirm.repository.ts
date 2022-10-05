import { UserMember } from 'src/auth/entities/user-member.entity';
import { EntityRepository, Repository } from 'typeorm';
import { EmojiConfirm } from '../entities/emoji-confirm.entity';
import { EmojiInfo } from '../entities/emoji-info.entity';
import { HttpException } from '@nestjs/common';

@EntityRepository(EmojiConfirm)
export class EmojiConfirmRepository extends Repository<EmojiConfirm> {
  async createEmojiInfo(
    userMember: UserMember,
    emojiInfo: EmojiInfo,
  ): Promise<EmojiConfirm> {
    const emojiConfirmModule = this.create({
      userMember,
      emojiInfo,
    });

    return await this.save(emojiConfirmModule);
  }

  async findAllEmojiConfirmByUsername(
    username: string,
    page: number,
  ): Promise<{
    proposals: EmojiConfirm[];
    totalPage: number;
  }> {
    const perPage = 5;
    const skip = perPage * page - perPage;

    try {
      const [list, cnt] = await Promise.all([
        this.createQueryBuilder('emojiConfirm')
          .leftJoinAndSelect('emojiConfirm.emojiInfo', 'emojiInfo')
          .leftJoinAndSelect('emojiConfirm.userMember', 'userMember')
          .where('userMember.username = :username', { username })
          .select('emojiConfirm.id', 'id')
          .addSelect('emojiConfirm.createdAt', 'createdAt')
          .addSelect('emojiConfirm.is_confirm', 'is_confirm')
          .addSelect('emojiInfo.product_name', 'product_name')
          .addSelect('emojiInfo.category', 'category')
          .addSelect('emojiInfo.tag', 'tag')
          .addSelect('emojiInfo.comment', 'comment')
          .limit(perPage)
          .offset(skip)
          .getRawMany(),
        this.count(),
      ]);

      const totalPage = Math.ceil(cnt / perPage);

      return {
        proposals: list,
        totalPage,
      };
    } catch (error) {
      new HttpException('not found emoji info', 404);
    }
  }
}
