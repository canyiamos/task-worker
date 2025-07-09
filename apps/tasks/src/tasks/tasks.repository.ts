import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskDocument } from './entities/task.entity';

@Injectable()
export class TasksRepository extends AbstractRepository<TaskDocument> {
  protected readonly logger = new Logger(TasksRepository.name);
  constructor(
    @InjectModel(TaskDocument.name)
    protected readonly taskModel: Model<TaskDocument>,
  ) {
    super(taskModel);
  }
}
