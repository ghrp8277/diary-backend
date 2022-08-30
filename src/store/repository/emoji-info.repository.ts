import { HttpException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UploadFileInfoDto } from '../dto/upload-file-info.dto';
import { EmojiInfo } from '../entities/emoji-info.entity';

@EntityRepository(EmojiInfo)
export class EmojiInfoRepository extends Repository<EmojiInfo> {
  async createEmojiInfo(
    uploadFileInfoDto: UploadFileInfoDto,
  ): Promise<EmojiInfo> {
    const emojiInfoModule = this.create(uploadFileInfoDto);

    return await this.save(emojiInfoModule);
  }

  async findAllEmojiInfo(username: string): Promise<EmojiInfo[]> {
    try {
      return await this.createQueryBuilder('emojiInfo')
        .leftJoinAndSelect('emojiInfo.imageFile', 'imageFile')
        .leftJoinAndSelect('imageFile.user_member', 'userMember')
        .where('userMember.username = :username', { username })
        .select('emojiInfo.createdAt', 'createdAt')
        .addSelect('emojiInfo.is_confirm', 'is_confirm')
        // .addSelect('emoji')
        .addSelect('imageFile.original_name', 'original_name')
        .addSelect('userMember.username', 'username')
        .getRawMany();
    } catch (error) {
      new HttpException('not found emoji info', 404);
    }
  }
}
