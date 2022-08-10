import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileRepository } from './repository/image-file.repository';
import { AuthService } from '../auth/auth.service'

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(ImageFileRepository)
        private readonly imageFileRepository: ImageFileRepository,
        private readonly authService: AuthService
    ) {}
    // 이미지 파일 업로드
    async imageFileSave(username: string, files: Express.Multer.File[]): Promise<void> {
        const user = await this.authService.findUserByUsername(username)

        await this.imageFileRepository.imageFileSave(user.id, files);
    }
}
