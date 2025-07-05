import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        const redisClient = new Redis(
          configService.get<string>('REDIS_HOST', 'redis://localhost') +
            ':' +
            configService.get<number>('REDIS_PORT', 6379),
        );

        return {
          store: {
            create: () => ({
              get: async (key: string): Promise<any> => {
                const value = await redisClient.get(key);
                return value ? JSON.parse(value) : null;
              },
              set: async (key: string, value, ttl: number): Promise<any> => {
                if (ttl) {
                  await redisClient.set(key, JSON.stringify(value), 'PX', ttl);
                } else {
                  await redisClient.set(key, JSON.stringify(value));
                }
                return value;
              },
              del: async (key: string) => {
                await redisClient.del(key);
              },
              reset: async () => {
                await redisClient.flushdb();
              },
            }),
          },
        };
      },
    }),
  ],
})
export class CacheModule {}
