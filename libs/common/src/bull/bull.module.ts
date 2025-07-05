import { BullModule as NestBullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestBullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'ajo_redis'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
  ],
})
export class BullModule {}
