import { ImageFile } from 'src/store/entities/image-file.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ImageFile)
export class ImageFileRepository extends Repository<ImageFile> {
  async imageFileSave(files: Express.Multer.File[]) {
    try {
      files.forEach((imageFile) => {
        const {
          originalname,
          mimetype,
          path,
          size
        } = imageFile
  
        const imageFileModule = this.create({ 
          original_name: originalname,
          mimeType: mimetype,
          file_path: path,
          file_size: size
        });
  
        this.save(imageFileModule);
      })
    } catch (error) {
      // 동일 파일이 저장되어있다면 에러에 대한 처리
      console.log(error.message)
    }
  }
}
