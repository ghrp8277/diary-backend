import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileRepository } from './repository/image-file.repository';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(ImageFileRepository)
        private readonly imageFileRepository: ImageFileRepository,
    ) {}
    // 이미지 파일 업로드
    async imageFileSave(files: Express.Multer.File[]): Promise<void> {
        await this.imageFileRepository.imageFileSave(files);
    }
}
