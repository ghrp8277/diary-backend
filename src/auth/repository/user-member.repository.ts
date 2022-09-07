import {
  ConflictException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserMember } from '../entities/user-member.entity';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { UserInfo } from '../entities/user-info.entity';
import { UserToken } from '../entities/user-token.entity';

@EntityRepository(UserMember)
export class UserMemberRepository extends Repository<UserMember> {
  // 회원가입
  async createUser(userCreateInterface: {
    username: string;
    password: string;
    userInfo: UserInfo;
  }): Promise<UserMember> {
    try {
      const { username, password, userInfo } = userCreateInterface;

      const hashedPassword = await this.changePasswordByHashedPassword(
        password,
      );

      const user = this.create({
        username,
        password: hashedPassword,
        userInfo,
      });

      return await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new UnauthorizedException('user create error!' + error.message);
      }
    }
  }

  // 해쉬 비밀번호로 변경
  async changePasswordByHashedPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  // 계정 중복 확인
  async idDuplicateCheck(username: string): Promise<boolean> {
    const userMember = await this.findOne({ username });

    if (userMember) return true;
    else return false;
  }

  // 아이디 찾기
  async findEmailByUserMember(e_mail: string): Promise<UserMember> {
    const userMember = await this.createQueryBuilder('user_member')
      .innerJoinAndSelect(
        'user_member.user_info_id',
        'user_info',
        'user_info.e_mail = :e_mail',
        { e_mail },
      )
      .select('user_member.id', 'id')
      .addSelect('user_member.username', 'username')
      .getRawOne();

    return userMember;
  }

  // 아이디 찾기 - 계정으로 찾기
  async findUsernameByUserMember(username: string): Promise<UserMember> {
    const userMember = await this.findOne({ username });
    return userMember;
  }

  // 비밀번호 변경
  async changePassword(username: string, password: string): Promise<boolean> {
    try {
      const hashedPassword = await this.changePasswordByHashedPassword(
        password,
      );
      const userMember = await this.findOne({ username });

      await this.update(userMember.id, {
        password: hashedPassword,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  /* -------------------------------------------------------------------------- */
  // 저장된 회원 검증
  async signIn(authLoginDto: AuthLoginDto): Promise<UserMember> {
    const { username, password } = authLoginDto;
    const user = await this.findUserByUsername(username);

    if (user && (await this.passwordCompare(password, user.password))) {
      return user;
    } else {
      throw new UnauthorizedException('login failed');
    }
  }

  // 비밀번호 검증
  async passwordCompare(password1: string, password2: string) {
    return await bcrypt.compare(password1, password2);
  }

  // 토큰 저장
  async registerRefreshToken(
    user_id: number,
    userToken: UserToken,
  ): Promise<void> {
    const user = await this.findUserById(user_id);

    await this.update(user.id, {
      userToken,
    });
  }

  async findUserById(user_id: number): Promise<UserMember> {
    const user = await this.findOne({ id: user_id });
    return user;
  }

  async findUserByUsername(username: string): Promise<UserMember> {
    const user = await this.findOne({ username });

    return user;
  }

  async findRefreshTokenId(username: string): Promise<number> {
    const user = await this.findUserByUsername(username);
    return user.userToken.id;
  }

  async findRefreshTokenByUsername(username: string): Promise<string> {
    const userToken = await this.createQueryBuilder('user_member')
      .innerJoinAndSelect('user_member.user_token_id', 'user_token')
      .select('user_token.token', 'token')
      .where('user_member.username = :username', { username })
      .getRawOne();

    return userToken.token;
  }

  async findRefreshTokenByToken(token: string): Promise<string> {
    try {
      const userToken = await this.createQueryBuilder('user_member')
        .innerJoinAndSelect('user_member.user_token_id', 'user_token')
        .where('user_token.token = :token', { token })
        .select('user_token.token', 'token')
        .getRawOne();

      return userToken.token;
    } catch (error) {
      const message: string = error.message;

      if (message.search('undefined') > 0) {
        throw new HttpException(
          'Your token has expired, send a refresh token to renew it',
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(message, HttpStatus.FORBIDDEN);
      }
    }
  }

  async findUserByWithoutPassword(userId: number): Promise<UserMember | null> {
    const user = await this.findOne({
      select: ['id', 'username'],
      where: { id: userId },
    });

    return user;
  }

  async removeRefreshToken(token: string): Promise<string> {
    try {
      const idObj = await this.createQueryBuilder('user_member')
        .leftJoinAndSelect('user_member.user_token_id', 'user_token')
        .where('user_token.token = :token', { token })
        .select('user_token.id', 'token_id')
        .addSelect('user_member.id', 'id')
        .getRawOne();

      await this.update(idObj.id, {
        userToken: null,
      });
      return idObj.token_id;
    } catch (error) {
      // throw new UnauthorizedException(error.message);
      throw new UnauthorizedException(
        'Your token has expired, send a refresh token to renew it',
      );
    }
  }
}
