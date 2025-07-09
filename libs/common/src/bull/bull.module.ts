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
          host: configService.get<string>('REDIS_HOST', 'frontier_redis'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
        defaultJobOptions: {
          attempts: 3, // Max number of attempts for failed jobs
          removeOnComplete: 1000, // Keep data for the last 1000 completed jobs
          removeOnFail: 3000, // Keep data for the last 3000 failed jobs
          backoff: 2000, // Wait at least 2 seconds before attempting the job again, after failure,
          timeout: 60000, // Set timeout for job execution
        },
      }),
    }),
  ],
})
export class BullModule {}
