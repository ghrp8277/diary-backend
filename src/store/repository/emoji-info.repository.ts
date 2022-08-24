import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { EmojiInfo } from '../entities/emoji-info.entity';
import { ImageFile } from '../entities/image-file.entity';

@EntityRepository(EmojiInfo)
export class EmojiInfoRepository extends Repository<EmojiInfo> {
  async emojiInfoSave(imageFile: ImageFile): Promise<EmojiInfo> {
    const emojiInfoModule = this.create({ 
        imageFile
    });

    return await this.save(emojiInfoModule);
  }

  // async findEmojiInfoByCreateAt(date: Date): Promise<EmojiInfo[]> {
  //   this.find({
  //     createdAt: date
  //   })
  // }
  
  async deleteEmojiInfo(id: number): Promise<DeleteResult> {
    const module = await this.findOne({
      id
    })

    console.log(module)
    return await this.delete(module)
    // return await this.delete({
    //   id: id
    // })
  }
}

// 카테고리 
// 1차 string
// 2차 string
