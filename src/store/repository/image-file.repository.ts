import { ImageFile } from 'src/store/entities/image-file.entity';
import { EntityRepository, Repository } from 'typeorm';
import { ImageFileInterface } from '../interface/image.interface';

@EntityRepository(ImageFile)
export class ImageFileRepository extends Repository<ImageFile> {
  async imageFileSave(imageFile: ImageFileInterface) {
    const { name, image_file, mimeType } = imageFile;

    // const imageFileModule = this.create({
    //   name,
    //   image_file,
    //   mimeType,
    // });

    // this.save(imageFileModule);
  }
}
