import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserMemberRepository } from './repository/user-member.repository';
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from '../configs/jwt.config';
import { UserTokenRepository } from './repository/user-token.repository';
import { UserTokenDto } from './dto/token.dto';
import { UserMember } from './entities/user-member.entity';
import { JwtExpiredException } from '../common/exceptions/jwt-expired.exception';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { UserInfoRepository } from './repository/user-info.repository';
import { Cache } from 'cache-manager';
import { ChangePasswordDto } from './dto/password-change.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { OAuthCredentialsDto } from './dto/oauth-credential.dto';
import { compare, hash } from 'bcrypt';
import { emailHtml } from './auth.mail';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(UserMemberRepository)
    private readonly userMemberRepository: UserMemberRepository,
    @InjectRepository(UserTokenRepository)
    private readonly userTokenRespository: UserTokenRepository,
    @InjectRepository(UserInfoRepository)
    private readonly userInfoRepository: UserInfoRepository,
  ) {}
  // 회원가입
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { email, username, password } = authCredentialsDto;

    const userInfo = await this.userInfoRepository.registerUserInfo(email);

    const userCreateModule = {
      username,
      password,
      userInfo,
    };
    await this.userMemberRepository.createUser(userCreateModule);

    return 'user create success!';
  }

  // 계정 중복확인
  async idDuplicateCheck(username: string): Promise<boolean> {
    return await this.userMemberRepository.idDuplicateCheck(username);
  }

  // 이메일 중복확인
  async emailDuplicateCheck(e_mail: string): Promise<boolean> {
    return await this.userInfoRepository.emailDuplicateCheck(e_mail);
  }

  async findUserByUsername(username: string): Promise<UserMember> {
    return await this.userMemberRepository.findUserByUsername(username);
  }

  // 아이디 찾기
  async findEmailById(e_mail: string): Promise<string> {
    const userMember = await this.userMemberRepository.findEmailByUserMember(
      e_mail,
    );
    return userMember.username;
  }

  // 이메일로 랜덤 비밀번호 전송
  async sendMailRandomPassword(
    username: string,
    e_mail: string,
  ): Promise<boolean> {
    // 랜덤 비밀번호 생성
    const randomPassword = Math.random().toString(36).slice(2);

    // 기존 비밀번호를 랜덤 비밀번호로 변경
    const isChange = await this.userMemberRepository.changePassword(
      username,
      randomPassword,
    );

    if (isChange) {
      // 인증 메일을 보낸다
      await this.mailerService.sendMail({
        to: e_mail, // list of receivers
        from: `${this.configService.get('MAIL_USER')}@naver.com`, // sender address
        subject: '임시 비밀번호 입니다.', // Subject line
        html: '임시 비밀번호 : ' + `<b> ${randomPassword}</b>`, // HTML body content
      });
      return true;
    } else return false;
  }

  // 비밀번호 변경
  async changePassword(changePasswordDto: ChangePasswordDto): Promise<boolean> {
    const { username, password, new_password } = changePasswordDto;

    const user = await this.userMemberRepository.findUserByUsername(username);
    // 비밀번호 검증
    const isPasswordCheck = await this.userMemberRepository.passwordCompare(
      password,
      user.password,
    );
    if (isPasswordCheck) {
      await this.userMemberRepository.changePassword(username, new_password);
      return true;
    } else return false;
  }

  // 로그인
  async signIn(
    authLoginDto: AuthLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userMemberRepository.signIn(authLoginDto);

    const isActive = await this.userInfoRepository.userActiveMatch(
      user.userInfo.id,
    );

    // 유저정보가 저장되어 있는지 확인 및 활성화 되어 있는 유저 정보인지
    if (user && isActive) {
      let refreshToken = '';
      let accessToken = '';

      try {
        // 로그인 할때는 기존 리프레시 토큰은 무조건 삭제 후 다시 생성
        if (!user.userToken) {
          refreshToken = await this.createRefreshToken(user.id);
        } else {
          refreshToken = await this.findRefreshTokenByUsername(user.username);

          await this.removeRefreshToken(refreshToken);

          refreshToken = await this.createRefreshToken(user.id);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        // 리프레시 토큰이 만료되었는지 검증 후 엑세스 토큰 생성
        accessToken = await this.createAccessToken(refreshToken);
      }

      return {
        accessToken,
        refreshToken,
      };
    }
  }

  // email 인증
  async emailAuth(e_mail: string): Promise<boolean> {
    try {
      // 난수코드 6자리 생성
      const number = this.generateRandomCode(6);

      // 인증 메일을 보낸다
      await this.mailerService.sendMail({
        to: e_mail, // list of receivers
        from: `${this.configService.get('MAIL_USER')}@naver.com`, // sender address
        subject: '[Diary Studio] 계정 가입 인증번호', // Subject line
        html: emailHtml(number), // HTML body content
      });

      // 캐시에 난수코드를 저장한다
      await this.cacheManager.set(e_mail, number);

      return true;
    } catch (error) {
      throw new HttpException(error.message, 401);
    }
  }

  // email 번호 인증
  async emailNumberAuth(e_mail: string, number: string): Promise<boolean> {
    try {
      // 캐시에 저장된 난수코드를 가져온다
      const saveNumber = await this.cacheManager.get(e_mail);

      if (number === saveNumber) {
        // 캐시에 저장된 난수코드를 삭제한다

        return true;
      }
      return false;
    } catch (error) {
      throw new HttpException(error.message, 401);
    }
  }

  // 난수 생성
  generateRandomCode(cnt: number): string {
    let str = '';
    for (let i = 0; i < cnt; i++) {
      str += Math.floor(Math.random() * 10);
    }
    return str;
  }

  // 리프레시 토큰 생성
  async createRefreshToken(user_id: number): Promise<string> {
    const refreshToken = await this.createToken(
      { id: user_id },
      REFRESH_TOKEN_EXP,
    );

    const hashedRefreshToken = await hash(refreshToken, 10);

    // 토큰 DB에 저장
    await this.registerRefreshToken({
      user_id,
      token: hashedRefreshToken,
    });

    return refreshToken;
  }

  // 리프레시 토큰 저장
  async registerRefreshToken(userTokenDto: UserTokenDto): Promise<void> {
    const { user_id, token } = userTokenDto;

    const tokenModule = await this.userTokenRespository.registerRefreshToken(
      token,
    );

    await this.userMemberRepository.registerRefreshToken(user_id, tokenModule);
  }

  // 리프레시 토큰 찾기 #1 유저명
  async findRefreshTokenByUsername(username: string): Promise<string> {
    const refreshToken =
      await this.userMemberRepository.findRefreshTokenByUsername(username);

    return refreshToken;
  }

  // 리프레시 토큰 찾기 #2 토큰 검증일때 사용
  async findRefreshTokenByHashMatched(
    token: string,
    username: string,
  ): Promise<string> {
    const refreshToken =
      await this.userMemberRepository.findRefreshTokenByUsername(username);

    const isMatched = await compare(token, refreshToken);

    if (isMatched) {
      const accessToken = await this.createAccessToken(token);

      return accessToken;
    }

    throw new HttpException('token verification failed!!', 401);
  }

  // 리프레시 토큰 삭제
  async removeRefreshToken(token: string): Promise<void> {
    const token_id = await this.userMemberRepository.removeRefreshToken(token);

    await this.userTokenRespository.removeRefreshToken(token_id);
  }

  // 엑세스 토큰 생성
  async createAccessToken(token: string): Promise<string> {
    try {
      // 리프레시 토큰 유효기간 검증, 기간 내일경우 엑세스 토큰 생성
      const verify = await this.tokenVerify(token);

      return this.createToken({ id: verify.id }, ACCESS_TOKEN_EXP);
    } catch (error) {
      // 리프레시 토큰이 기간 만료된 토큰일 경우 삭제
      if (error instanceof JwtExpiredException) {
        await this.removeRefreshToken(token);

        throw new HttpException('please login again', 463);
      }
    }
  }

  // 토큰 생성
  createToken(paylaod: { id: number }, exp: string): string {
    const token = this.jwtService.sign(paylaod, {
      expiresIn: exp,
    });
    return token;
  }

  async findUserByWithoutPassword(id: number): Promise<UserMember> {
    const user = await this.userMemberRepository.findUserByWithoutPassword(id);
    return user;
  }

  // 토큰 검증
  async tokenVerify(
    token: string,
    options?: JwtVerifyOptions,
  ): Promise<{
    iat: number;
    exp: number;
    id: number;
  }> {
    try {
      // iat = jwt 발행된 시간
      // exp = jwt 만료 시간
      const verify = this.jwtService.verify<{
        iat: number;
        exp: number;
        id: number;
      }>(token, options);
      return verify;
    } catch (error) {
      const message = error.message;

      console.log(message);
      switch (message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'invalid signature':
        case 'INVALID_TOKEN':
        case 'TOKEN_IS_ARRAY':
        case 'jwt malformed':
          throw new HttpException('jwt 토큰을 찾을 수 없습니다.', 411);
        case 'invalid token':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);
        case 'NO_USER':
          throw new HttpException('유효하지 않은 토큰입니다.', 401);
        case 'jwt expired':
          throw new JwtExpiredException(
            410,
            'Your token has expired, send a refresh token to renew it.',
          );
        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}
