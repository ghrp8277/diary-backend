import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const REFRESH_TOKEN_EXP = '7days';
export const ACCESS_TOKEN_EXP = '24hr';
// export const REFRESH_TOKEN_EXP = '10sec';
// export const ACCESS_TOKEN_EXP = '15sec';

export default (configService: ConfigService) => {
  const jwtConfig: JwtModuleOptions = {
    secret: configService.get('JWT_SECRET_KEY'),
  };

  return jwtConfig;
};
