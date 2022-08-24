import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileRepository } from './repository/image-file.repository';
import { AuthService } from '../auth/auth.service'
import { HttpException } from '@nestjs/common';
import { ImageFile } from './entities/image-file.entity';
import { EmojiInfoRepository } from './repository/emoji-info.repository';
import { EmojiInfo } from './entities/emoji-info.entity';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository(ImageFileRepository)
        private readonly imageFileRepository: ImageFileRepository,
        @InjectRepository(EmojiInfoRepository)
        private readonly emojiInfoRepository: EmojiInfoRepository,
        private readonly authService: AuthService
    ) {}
    // 이미지 파일 업로드
    async imageFileSave(username: string, files: Express.Multer.File[]): Promise<void> {
        const user = await this.authService.findUserByUsername(username)

        try {
            files.forEach(async (file) => {
                const imageFile = await this.imageFileRepository.imageFileSave(user.id, file);

                const emojiInfo = await this.emojiInfoSave(imageFile);

                await this.imageFileRepository.updateImageFileByEmojiInfo(
                    imageFile.id, 
                    emojiInfo
                );
            })
        } catch (error) {
            // 동일 파일이 저장되어있다면 에러에 대한 처리
            throw new HttpException('file name is unique error', 422)
        }
    }

    // 이모지 정보 저장
    async emojiInfoSave(imageFile: ImageFile): Promise<EmojiInfo> {
        return await this.emojiInfoRepository.emojiInfoSave(imageFile);
    }

    // 이미지 파일 삭제
    async emojiInfoDelete(id: number): Promise<boolean> {
        const deleteResult = await this.emojiInfoRepository.deleteEmojiInfo(id)
        return true
        // if (deleteResult) return true
        // else return false
    }
}
