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
}
