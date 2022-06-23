import {
    ConflictException,
    HttpException,
    HttpStatus,
    UnauthorizedException,
  } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserOAuth } from '../entities/user-oauth.entity';
  
  @EntityRepository(UserOAuth)
  export class UserOAuthRepository extends Repository<UserOAuth> {
    // 회원가입
    async createUser(username: string): Promise<UserOAuth> {
      try {
        const user = this.create({
          username,
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

    // 가입된 이력 찾기
    async findUserByUsername(username: string): Promise<boolean> {
      const oauth = await this.findOne({ username })
      if (oauth) return true
      else return false
    }


    async findUserOAuthByUsername(username: string): Promise<UserOAuth> {
      return await this.findOne({ username })
    }

  // 토큰 저장
  async registerRefreshToken(user_id: number, token_id: number): Promise<void> {
    await this.update(user_id, {
      user_token_id: token_id,
    });
  }
  }
  