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
      user_member: userMember,
      emojiInfo,
    });

    return await this.save(emojiConfirmModule);
  }

  async findAllEmojiConfirm(username: string): Promise<EmojiConfirm[]> {
    try {
      return await this.createQueryBuilder('emojiConfirm')
        .leftJoinAndSelect('emojiConfirm.emojiInfo', 'emojiInfo')
        .leftJoinAndSelect('emojiConfirm.user_member', 'userMember')
        .where('userMember.username = :username', { username })
        .select('emojiConfirm.id', 'id')
        .addSelect('emojiConfirm.createdAt', 'createdAt')
        .addSelect('emojiConfirm.is_confirm', 'is_confirm')
        .addSelect('emojiInfo.product_name', 'product_name')
        .getRawMany();
    } catch (error) {
      new HttpException('not found emoji info', 404);
    }
  }
}
