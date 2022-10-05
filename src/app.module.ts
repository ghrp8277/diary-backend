import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import typeORMConfig from './configs/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { MailerModule } from '@nestjs-modules/mailer';
import { BoardController } from './board/board.controller';
import { BoardModule } from './board/board.module';
import mailerConfig from './configs/mailer.config';
import { JwtLoginGuard } from './auth/jwt/jwt.guard';
import { StoreModule } from './store/store.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BuyerModule } from './buyer/buyer.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'files'),
    }),
    ConfigModule.forRoot({ envFilePath: ['dev.env', '.env'] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeORMConfig(configService),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => mailerConfig(configService),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    BoardModule,
    StoreModule,
    BuyerModule,
  ],
  controllers: [AppController, BoardController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtLoginGuard,
    },
    TasksService,
  ],
})
export class AppModule {}
