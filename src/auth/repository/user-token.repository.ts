import { UnauthorizedException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserToken } from '../entities/user-token.entity';

@EntityRepository(UserToken)
export class UserTokenRepository extends Repository<UserToken> {
  async registerRefreshToken(token: string, expiresAt?: string): Promise<UserToken> {
    const userToken = this.create({ 
      token,  
      create_at: expiresAt
    });
    return await this.save(userToken);
  }

  async findRefreshTokenByTokenId(tokenId: string): Promise<UserToken> {
    const userToken = await this.findOne({ where: { id: tokenId } });
    return userToken;
  }

  async removeRefreshToken(tokenId: string): Promise<void> {
    try {
      const userToken = await this.findRefreshTokenByTokenId(tokenId);
      await this.delete({ id: userToken.id });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
