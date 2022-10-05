import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
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

    const { authorization, ispublic, cookie } = request.headers;

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

    console.log(token);

    // if (cookie === undefined) {
    //   throw new HttpException('Cookie 전송 안됨', HttpStatus.UNAUTHORIZED);
    // }

    // if (cookie.indexOf('Authorization') < 0) {
    //   throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
    // }

    // const token = cookie.replace('Authorization=', '');

    try {
      // 엑세스 토큰 유효기간 검증
      await this.authService.tokenVerify(token);

      return true;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, error.status);
    }
  }
}
