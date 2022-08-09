import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileInterface } from './interface/image.interface';
import { ImageFileRepository } from './repository/image-file.repository';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(ImageFileRepository)
        private readonly imageFileRepository: ImageFileRepository,
    ) {}
    // 이미지 파일 업로드
    async imageFileSave(imageFile: ImageFileInterface): Promise<void> {
        await this.imageFileRepository.imageFileSave(imageFile);
    }
}
