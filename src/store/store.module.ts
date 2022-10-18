import { forwardRef, Module } from '@nestjs/common';
import { StoreService } from './service/store.service';
import { StoreController } from './store.controller';
import { ImageFileRepository } from './repository/image-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmojiInfoRepository } from './repository/emoji-info.repository';
import { EmojiConfirmRepository } from './repository/emoji-confirm.repository';
import { BuyerModule } from 'src/buyer/buyer.module';
import { StoreNoticeService } from './service/store.notice.service';
import { StudioNoticeRepository } from './repository/studio-notice.repository';
import { EmojiCategoryRepository } from './repository/emoji-category.repository';
import { EmojiTagRepository } from './repository/emoji-tag.repository';
import { EmojiGroupRepository } from './repository/emoji-group.repository';
import { EmojiGroupItemRepository } from './repository/emoji-group-item.repository';
import { StoreGroupService } from './service/store.group.service';

@Module({
  imports: [
    forwardRef(() => BuyerModule),
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([
      ImageFileRepository,
      EmojiInfoRepository,
      EmojiConfirmRepository,
      StudioNoticeRepository,
      EmojiCategoryRepository,
      EmojiTagRepository,
      EmojiGroupRepository,
      EmojiGroupItemRepository,
    ]),
  ],
  providers: [
    StoreService,
    StoreNoticeService,
    ConfigService,
    StoreGroupService,
  ],
  controllers: [StoreController],
  exports: [StoreService, StoreGroupService],
})
export class StoreModule {}
