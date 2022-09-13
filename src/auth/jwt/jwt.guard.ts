import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtExpiredException } from 'src/common/exceptions/jwt-expired.exception';
import { AuthService } from '../auth.service';

const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// https://kiwi-wiki.tistory.com/27
// AuthGuard -> strategy 자동으로 실행하는 기능
@Injectable()
export class JwtLoginGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization, ispublic } = request.headers;

    const isPublic = ispublic
      ? JSON.parse(ispublic)
      : this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);

    if (isPublic) return isPublic;

    if (authorization === undefined) {
      throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
    }

    const token = authorization.replace('Bearer ', '');

    try {
      // 엑세스 토큰 유효기간 검증
      await this.authService.tokenVerify(token);

      return true;
    } catch (error) {
      // 엑세스 토큰 기간 만료시
      if (error instanceof JwtExpiredException) {
        await this.refrechTokenVerification(token);
      }
    }
  }

  async refrechTokenVerification(token: string) {
    try {
      // step1 : DB에 저장된 리프레시 토큰이 일치하는지 확인 후 일치하면 리프레시 토큰값을 가져옴
      const refreshToken = await this.authService.findRefreshTokenByToken(
        token,
      );
      // step2 : 가져온 리프레시 토큰이 기간 만료되었는지 검증
      await this.authService.tokenVerify(refreshToken);
    } catch (error) {
      if (error instanceof JwtExpiredException) {
        // step3 : 만료가 되었다면 삭제
        await this.authService.removeRefreshToken(token);

        // step4 : 만료가 되어 리프레시 토큰을 삭제하였으니 다시 재로그인 하라고 신호 알려줌
        throw new HttpException(
          'The refresh token period has expired, please login again',
          HttpStatus.FORBIDDEN,
        );
      }

      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }
}
