import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TasksModule } from './tasks/tasks.module';

import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

import { RequestMethod, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(TasksModule);

  const configService = app.get(ConfigService);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useBodyParser('json', { limit: '10mb' });

  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  /**
   * Activate CORS
   */
  const corsHeaders = [
    'Origin',
    'Accept',
    'Authorization',
    'DNT',
    'X-Mx-ReqToken',
    'Keep-Alive',
    'User-Agent',
    'X-Requested-With',
    'If-Modified-Since',
    'Cache-Control',
    'Content-Type',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'Access-Control-Allow-Headers',
  ];

  const allowedCorsOrigins = [
    /^http:\/\/localhost(:[\d]+)?$/,
    /^http:\/\/127\.0\.0\.1(:[\d]+)?$/,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        // Allow requests with no origin (like mobile apps or curl requests)
        return callback(null, true);
      }
      // Check allowed origins with regular expression matching
      if (allowedCorsOrigins.some((regex) => regex.test(origin))) {
        return callback(null, true);
      } else {
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    allowedHeaders: corsHeaders,
    exposedHeaders: corsHeaders,
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(configService.get('PORT', 3000));
}
bootstrap();
