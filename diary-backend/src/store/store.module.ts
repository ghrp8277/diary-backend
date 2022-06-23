import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { ImageFileRepository } from './repository/image-file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([ImageFileRepository]),
  ],
  providers: [StoreService, ConfigService],
  controllers: [StoreController]
})
export class StoreModule {}
