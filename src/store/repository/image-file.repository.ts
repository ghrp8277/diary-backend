import { ImageFile } from 'src/store/entities/image-file.entity';
import { EntityRepository, Repository } from 'typeorm';
import { EmojiInfo } from '../entities/emoji-info.entity';

@EntityRepository(ImageFile)
export class ImageFileRepository extends Repository<ImageFile> {
  async imageFileSave(user_id: number, file: Express.Multer.File): Promise<ImageFile> {
    const {
      originalname,
      mimetype,
      path,
      size
    } = file

    const imageFileModule = this.create({ 
        user_member_id: user_id,
        original_name: originalname,
        mimeType: mimetype,
        file_path: path,
        file_size: size
    });

    return this.save(imageFileModule);
  }

  async updateImageFileByEmojiInfo(id: number, emojiInfo: EmojiInfo): Promise<void> {
    this.update(id, {
      emojiInfo
    })
  }
}

// 카테고리 
// 1차 string
// 2차 string
