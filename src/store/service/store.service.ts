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
import { BuyerService } from 'src/buyer/services/buyer.service';
import { Connection } from 'typeorm';
import { EmojiCategoryRepository } from '../repository/emoji-category.repository';
import { EmojiTagRepository } from '../repository/emoji-tag.repository';
import { StoreGroupService } from './store.group.service';

@Injectable()
export class StoreService {
  constructor(
    private connection: Connection,
    @InjectRepository(ImageFileRepository)
    private readonly imageFileRepository: ImageFileRepository,
    @InjectRepository(EmojiInfoRepository)
    private readonly emojiInfoRepository: EmojiInfoRepository,
    @InjectRepository(EmojiConfirmRepository)
    private readonly emojiConfirmRepository: EmojiConfirmRepository,
    @InjectRepository(EmojiCategoryRepository)
    private readonly emojiCategoryRepository: EmojiCategoryRepository,
    @InjectRepository(EmojiTagRepository)
    private readonly emojiTagRepository: EmojiTagRepository,
    private readonly authService: AuthService,
    private readonly buyerService: BuyerService,
    private readonly storeGroupService: StoreGroupService,
  ) {
    this.connection = connection;
  }
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
    const product = await this.buyerService.createProduct(emojiCofirm);

    // 이미지 파일 정보 저장
    files.forEach(async (file) => {
      await this.createImageFile(emojiCofirm, username, file);
    });

    const category = emojiInfo.category;
    const tag = emojiInfo.tag;

    const matched = this.categoryMatched(category);

    let group = null;

    group = await this.storeGroupService.findEmojiGroupByTitle(category);

    if (!group) {
      group = await this.storeGroupService.createEmojiGroup(
        category,
        matched.title,
        matched.bgColor,
        matched.textColor,
      );
    }

    const groupItem = await this.storeGroupService.findEmojiGroupItemByTitle(
      tag,
    );

    if (!groupItem) {
      const arr = [product.id];

      await this.storeGroupService.createEmojiGroupItem(tag, arr, group);
    } else {
      const id = groupItem.id;
      const items = groupItem.items;

      items.push(product.id);

      await this.storeGroupService.updateEmojiGroupItemByItems(id, items);
    }

    return {
      is_confirm: emojiCofirm.is_confirm,
      product_name: emojiInfo.product_name,
      category: emojiInfo.category,
      tag: emojiInfo.tag,
    };
  }

  categoryMatched(category: string) {
    switch (category) {
      case 'character':
        return {
          title: '인물',
          bgColor: '#74d394',
          textColor: '#fff',
        };
      case 'animal':
        return {
          title: '동물',
          bgColor: '#ff8686',
          textColor: '#fff',
        };
      case 'illustration':
        return {
          title: '일러스트',
          bgColor: '#93e0dd',
          textColor: '#fff',
        };
    }
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

  // 카테고리 정보를 들고온다.
  async findAllCategory() {
    return await this.emojiCategoryRepository.findAllCategory();
  }

  // 태그 정보들을 들고온다.
  async findTagByCategoryValue(category_value: string) {
    return await this.emojiTagRepository.findTagByCategoryValue(category_value);
  }

  // 특정 유저 이모지 승인단계 전체 정보 가져오기
  async findAllEmojiConfirmByUsername(username: string, page: number) {
    return await this.emojiConfirmRepository.findAllEmojiConfirmByUsername(
      username,
      page,
    );
  }
}
