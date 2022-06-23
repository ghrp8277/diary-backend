import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from './repository/board.repository';
import { EmotionFileRepository } from './repository/emotion-file.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([BoardRepository, EmotionFileRepository]),
  ],
  controllers: [BoardController],
  providers: [BoardService, ConfigService],
  exports: [BoardService],
})
export class BoardModule {}
