import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { JwtLoginGuard, Public } from './jwt/jwt.guard';
import { GetUser } from './decorator/get-user.decorator';
import { UserMember } from './entities/user-member.entity';
import { AuthEmailDto } from './dto/auth-email.dto';
import { ChangePasswordDto } from './dto/password-change.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OAuthCredentialsDto } from './dto/oauth-credential.dto';

@Public()
@ApiTags('AUTH API')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // 회원가입
  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    return await this.authService.signUp(authCredentialsDto);
  }

  // 비밀번호 변경
  @Put('/change/password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<boolean> {
    return await this.authService.changePassword(changePasswordDto);
  }

  // 계정 중복확인
  @Get('/check/id')
  async idCheck(@Query('username') username: string) {
    return await this.authService.idDuplicateCheck(username);
  }

  // 이메일 중복확인
  @Get('/check/email')
  async emailCheck(@Query('email') e_mail: string) {
    return await this.authService.emailDuplicateCheck(e_mail);
  }

  // 이메일 인증
  @Post('/email')
  async emailAuth(@Query('email') e_mail: string) {
    return await this.authService.emailAuth(e_mail);
  }

  // 이메일 임시비밀번호
  @Put('/email/password')
  async emailAuthPassword(
    @Query('username') username: string,
    @Query('email') e_mail: string
  ): Promise<boolean> {
    return await this.authService.sendMailRandomPassword(username, e_mail);
  }

  // 이메일 번호 인증
  @Post('/email/:number')
  async emailAuthNumber(
    @Query('email') e_mail: string,
    @Param('number') number: string,
  ) {
    return await this.authService.emailNumberAuth(e_mail, number);
  }

  // 아이디 찾기
  @Get('/find/id')
  async findId(@Query('email') e_mail: string): Promise<string> {
    return await this.authService.findEmailById(e_mail);
  }

  // 로그인
  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authLoginDto: AuthLoginDto,
    @Res() res: Response,
  ) {
    const jwt = await this.authService.signIn(authLoginDto);

    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    res.setHeader('ACCESS_TOKEN', jwt.accessToken);
    res.setHeader('REFRESH_TOKEN', jwt.refreshToken);
    return res.json(jwt);
  }

  // OAuth 카카오 로그인 or 회원가입 
  @Post('/kakao')
  async kakaoLogin(
    @Body() oauthCredentialsDto: OAuthCredentialsDto,
  ) {
      return await this.authService.oauthSignUp(oauthCredentialsDto);
  }
}
