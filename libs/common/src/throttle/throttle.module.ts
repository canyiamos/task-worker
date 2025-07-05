import { Module } from '@nestjs/common';
import { ThrottlerModule as NestThrottleModule } from '@nestjs/throttler';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestThrottleModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: +configService.get<number>('THROTTLE_TTL', 60000),
          limit: +configService.get<number>('THROTTLE_LIMIT', 10),
        },
      ],
    }),
  ],
})
export class ThrottlerModule {}
