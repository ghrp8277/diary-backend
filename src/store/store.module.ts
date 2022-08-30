import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { ImageFileRepository } from './repository/image-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmojiInfoRepository } from './repository/emoji-info.repository';
import { EmojiConfirmRepository } from './repository/emoji-confirm.repository';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([
      ImageFileRepository,
      EmojiInfoRepository,
      EmojiConfirmRepository,
    ]),
  ],
  providers: [StoreService, ConfigService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
