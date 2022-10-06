import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    BuyerModule,
    TypeOrmModule.forFeature([
      ImageFileRepository,
      EmojiInfoRepository,
      EmojiConfirmRepository,
      StudioNoticeRepository,
      EmojiCategoryRepository,
      EmojiTagRepository,
    ]),
  ],
  providers: [StoreService, StoreNoticeService, ConfigService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
