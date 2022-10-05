import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AuthPayload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  // 위에서 토큰이 유효한지 체크가 되면 validate 메소드에서 payload에 있는 유저이름이 데이터베이스에서
  // 있는 유저인지 확인 후 있다면 유저 객체를 return 값으로 던져줍니다.
  // return 값은 @UseGuards(AuthGuard())를 이용한 모든 요청의 Request Object에 들어갑니다.
  async validate(payload: AuthPayload) {
    const { id } = payload;
    const user = await this.authService.findUserByWithoutPassword(id);

    if (user) return user.username;
    else throw new UnauthorizedException('접근 오류');
  }
}
