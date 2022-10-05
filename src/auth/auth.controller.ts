import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { Response } from 'express';
import { Public, JwtLoginGuard } from './jwt/jwt.guard';
import { UserMember } from './entities/user-member.entity';
import { ChangePasswordDto } from './dto/password-change.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  PickType,
} from '@nestjs/swagger';
import { OAuthCredentialsDto } from './dto/oauth-credential.dto';

@Public()
@ApiTags('AUTH API')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // 회원가입
  @ApiOperation({
    summary: '회원가입',
    description: '다이어리 앱 웹 회원가입 api',
  })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string', default: 'test', description: '아이디' },
        password: {
          type: 'string',
          default: 'testtest',
          description: '비밀번호',
        },
        email: {
          type: 'string',
          default: 'test@gmail.com',
          description: '이메일',
        },
      },
    },
  })
  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    console.log(authCredentialsDto);
    return await this.authService.signUp(authCredentialsDto);
  }

  // refresh token 검증
  @Post('/refresh')
  async refreshTokenAuth(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body('username') username: string,
  ) {
    // const raw = req.headers.cookie;

    // const token = raw.replace('Refresh=', '');

    const raw = req.headers.authorization;

    const token = raw.replace('Bearer ', '');

    const accessToken = await this.authService.findRefreshTokenByHashMatched(
      token,
      username,
    );

    res.cookie('Authorization', accessToken, {
      // 3시간
      maxAge: 60 * 60 * 1000 * 3,
      httpOnly: true,
      sameSite: 'none',
    });

    return accessToken;
  }

  // 로그아웃
  @Delete('/logout')
  async logout(@Body('token') token: string) {
    await this.authService.removeRefreshToken(token);
  }

  // 비밀번호 변경
  @ApiOperation({
    summary: '비밀번호 변경',
  })
  @Put('/change/password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    return await this.authService.changePassword(changePasswordDto);
  }

  // 이메일 중복확인
  @Post('/email/check')
  async emailCheck(@Body('email') e_mail: string) {
    return await this.authService.emailDuplicateCheck(e_mail);
  }

  // 이메일 인증
  @Post('/email')
  async emailAuth(@Body('email') e_mail: string) {
    return await this.authService.emailAuth(e_mail);
  }

  // 이메일 임시비밀번호
  @Put('/email/password')
  async emailAuthPassword(
    @Query('username') username: string,
    @Query('email') e_mail: string,
  ): Promise<boolean> {
    return await this.authService.sendMailRandomPassword(username, e_mail);
  }

  // 이메일 번호 인증
  @ApiOperation({
    summary: '이메일 번호 인증',
  })
  @Post('/email/:number')
  async emailAuthNumber(
    @Body('email') e_mail: string,
    @Param('number') number: string,
  ) {
    return await this.authService.emailNumberAuth(e_mail, number);
  }

  // 아이디 찾기
  @ApiOperation({
    summary: '아이디 찾기',
    description: '다이어리 앱 웹 아이디 찾기 api',
  })
  @Get('/user/id')
  async findId(@Query('email') e_mail: string): Promise<string> {
    return await this.authService.findEmailById(e_mail);
  }

  // 계정 중복확인
  @Get('/user/:username/check')
  async idCheck(@Param('username') username: string) {
    return await this.authService.idDuplicateCheck(username);
  }

  // 로그인
  @ApiOperation({
    summary: '로그인',
    description: '다이어리 앱 웹 로그인 api',
  })
  @ApiCreatedResponse({
    description: '로그인 인증 성공',
    type: () => {
      return PickType(UserMember, ['username'] as const);
    },
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패',
  })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string', default: 'test', description: '아이디' },
        password: {
          type: 'string',
          default: 'testtest',
          description: '비밀번호',
        },
      },
    },
  })
  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authLoginDto: AuthLoginDto,
    @Res() res: Response,
  ) {
    const jwt = await this.authService.signIn(authLoginDto);

    res.cookie('Authorization', jwt.accessToken, {
      // 3시간
      maxAge: 60 * 60 * 1000 * 3,
      httpOnly: true,
      sameSite: 'none',
    });
    res.cookie('Refresh', jwt.refreshToken, {
      // 일주일
      maxAge: 604800 * 1000,
      httpOnly: true,
      sameSite: 'none',
    });
    return res.json(jwt);
  }
}
