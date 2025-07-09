import {
  BullModule,
  DatabaseModule,
  RedisModule,
  ThrottlerModule,
} from '@app/common';
import { BullModule as NestBullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as Joi from 'joi';
import { join } from 'path';
import { TaskDocument, TaskSchema } from './entities/task.entity';
import { TaskQueueEventsListener } from './tasks-queue.events';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { TaskProcessor } from './tasks.worker';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: TaskDocument.name, schema: TaskSchema },
    ]),
    RedisModule,
    ThrottlerModule,
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
      serveRoot: '/',
    }),
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
    BullModule,
    NestBullModule.registerQueue({
      name: 'task',
    }),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    TaskProcessor,
    TaskQueueEventsListener,
  ],
})
export class TasksModule {}
