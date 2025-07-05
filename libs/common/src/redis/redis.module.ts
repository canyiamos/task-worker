import { RedisModule as NestRedisMOdule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestRedisMOdule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url:
          configService.get<string>('REDIS_HOST', 'redis://localhost') +
          ':' +
          configService.get<number>('REDIS_PORT', 6379),
      }),
    }),
  ],
})
export class RedisModule {}
