import { HttpException } from '@nestjs/common';
import { ImageFile } from 'src/store/entities/image-file.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ImageFile)
export class ImageFileRepository extends Repository<ImageFile> {
  async imageFileSave(user_id: number, files: Express.Multer.File[]) {
    try {
      files.forEach((imageFile) => {
        const {
          originalname,
          mimetype,
          path,
          size
        } = imageFile
  
        const imageFileModule = this.create({ 
          user_member_id: user_id,
          original_name: originalname,
          mimeType: mimetype,
          file_path: path,
          file_size: size
        });
  
        this.save(imageFileModule);
      })
    } catch (error) {
      // 동일 파일이 저장되어있다면 에러에 대한 처리
      throw new HttpException('file name is unique error', 422)
    }
  }
}

// 카테고리 
// 1차 string
// 2차 string
