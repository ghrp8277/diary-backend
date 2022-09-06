import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileRepository } from '../repository/image-file.repository';
import { AuthService } from '../../auth/auth.service';
import { EmojiInfoRepository } from '../repository/emoji-info.repository';
import { EmojiConfirm } from '../entities/emoji-confirm.entity';
import { EmojiConfirmRepository } from '../repository/emoji-confirm.repository';
import { UploadFileInfoDto } from '../dto/upload-file-info.dto';
import { UserMember } from 'src/auth/entities/user-member.entity';
import { EmojiInfo } from '../entities/emoji-info.entity';
import { BuyerService } from 'src/buyer/buyer.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(ImageFileRepository)
    private readonly imageFileRepository: ImageFileRepository,
    @InjectRepository(EmojiInfoRepository)
    private readonly emojiInfoRepository: EmojiInfoRepository,
    @InjectRepository(EmojiConfirmRepository)
    private readonly emojiConfirmRepository: EmojiConfirmRepository,
    private readonly authService: AuthService,
    private readonly buyerService: BuyerService,
  ) {}
  // 이미지 파일 업로드
  async imageFileUpload(
    username: string,
    uploadFileInfoDto: UploadFileInfoDto,
    files: Express.Multer.File[],
  ): Promise<{
    is_confirm: any;
    product_name: string;
    category: string;
    tag: string;
  }> {
    const user = await this.authService.findUserByUsername(username);

    // 이모티콘 정보 저장
    const emojiInfo = await this.createEmojiInfo(uploadFileInfoDto);

    // 이모티콘 승인단계 저장
    const emojiCofirm = await this.createEmojiConfirm(user, emojiInfo);

    // buyer -> 상품 저장
    await this.buyerService.createProduct(emojiCofirm);

    // 이미지 파일 정보 저장
    files.forEach(async (file) => {
      await this.createImageFile(emojiCofirm, username, file);
    });

    return {
      is_confirm: emojiCofirm.is_confirm,
      product_name: emojiInfo.product_name,
      category: emojiInfo.category,
      tag: emojiInfo.tag,
    };
  }

  // 이모티콘 승인 단계 정보 저장
  async createEmojiConfirm(
    userMember: UserMember,
    emojiInfo: EmojiInfo,
  ): Promise<EmojiConfirm> {
    return await this.emojiConfirmRepository.createEmojiInfo(
      userMember,
      emojiInfo,
    );
  }

  // 이모티콘 정보 저장
  async createEmojiInfo(uploadFileInfoDto: UploadFileInfoDto) {
    return await this.emojiInfoRepository.createEmojiInfo(uploadFileInfoDto);
  }

  // 이미지 파일 정보 저장
  async createImageFile(
    emojiConfirm: EmojiConfirm,
    username: string,
    file: Express.Multer.File,
  ) {
    return await this.imageFileRepository.createImageFile(
      emojiConfirm,
      username,
      file,
    );
  }

  // 특정 유저 이모지 승인단계 전체 정보 가져오기
  async findAllEmojiConfirmByUsername(username: string) {
    return await this.emojiConfirmRepository.findAllEmojiConfirmByUsername(
      username,
    );
  }

  // 특정 유저 이모지 승인단계 정보 가져오기
  async findEmojiConfirmById(id: number) {
    return await this.emojiConfirmRepository.findEmojiConfirmById(id);
  }
}
