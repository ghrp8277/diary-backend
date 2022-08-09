import { CacheModuleOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

export default (configService: ConfigService) => {
  const cacheConfig: CacheModuleOptions = {
    store: redisStore,
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
    isGlobal: true,
    ttl: configService.get('EMAIL_CACHE_TTL'),
    max: configService.get('CACHE_MAX'),
  };

  return cacheConfig;
};
