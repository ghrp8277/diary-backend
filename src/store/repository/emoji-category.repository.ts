import { EntityRepository, Repository } from 'typeorm';
import { UploadFileCategoryDto } from '../dto/upload-file-category.dto';
import { EmojiCategory } from '../entities/emoji-category.entity';
import { ImageFile } from '../entities/image-file.entity';

@EntityRepository(EmojiCategory)
export class EmojiCategoryRepository extends Repository<EmojiCategory> {
  async emojiCategorySave(imageFile: ImageFile, categoryDto: UploadFileCategoryDto): Promise<EmojiCategory> {
    const emojiInfoModule = this.create(categoryDto);
    emojiInfoModule.imageFile = imageFile;
    return await this.save(emojiInfoModule);
  }
}