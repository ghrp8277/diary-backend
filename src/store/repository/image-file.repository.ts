import { ImageFile } from 'src/store/entities/image-file.entity';
import { EntityRepository, Repository } from 'typeorm';
import { EmojiConfirm } from '../entities/emoji-confirm.entity';
import { HttpException } from '@nestjs/common';
import * as ip from 'ip';

@EntityRepository(ImageFile)
export class ImageFileRepository extends Repository<ImageFile> {
  async createImageFile(
    emojiConfirm: EmojiConfirm,
    username: string,
    file: Express.Multer.File,
  ): Promise<ImageFile> {
    try {
      const { originalname, mimetype, path, size } = file;

      const before = path.substring(0, path.indexOf(username))
      const address: string = ip.address()
      const image_url = path.replace(before, `http://${address}:3000/`)

      const imageFileModule = this.create({
        emojiConfirm,
        original_name: originalname,
        mimeType: mimetype,
        file_path: path,
        file_size: size,
        image_url,
      });

      return this.save(imageFileModule);
    } catch (error) {
      // 동일 파일이 저장되어있다면 에러에 대한 처리
      throw new HttpException('file name is unique error', 422);
    }
  }
}
