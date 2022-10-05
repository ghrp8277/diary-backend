import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserMemberRepository } from './repository/user-member.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from '../configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { UserTokenRepository } from './repository/user-token.repository';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserInfoRepository } from './repository/user-info.repository';
import cacheConfig from 'src/configs/cache.config';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({
      defaultStrategy: ['jwt'],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => jwtConfig(configService),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        cacheConfig(configService),
    }),
    TypeOrmModule.forFeature([
      UserMemberRepository,
      UserTokenRepository,
      UserInfoRepository,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
