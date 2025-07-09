import { STATUS } from '@app/common';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectQueue('task') private readonly taskQueue: Queue,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.create(createTaskDto);
  }

  async findAll() {
    return this.tasksRepository.find({});
  }

  async findOne(_id: string) {
    return this.tasksRepository.findOne({ _id });
  }

  async update(_id: string, updateTaskDto: UpdateTaskDto) {
    return this.tasksRepository.findOneAndUpdate(
      { _id },
      { $set: updateTaskDto },
    );
  }

  async remove(_id: string) {
    const job: Job | null = await this.taskQueue.getJob(_id);
    if (job) {
      const state = await job.getState();

      if (state !== 'completed' && state !== 'failed') {
        await job.remove();
        return this.tasksRepository.findOneAndDelete({ _id });
      }

      throw new BadRequestException(
        `Task with this id - ${_id} already completed`,
      );
    }
  }

  async runTask(_id: string) {
    const task = await this.findOne(_id);
    await this.taskQueue.add(task.taskType, task.payload, {
      jobId: _id,
    });

    return { message: `Task ${_id} started` };
  }

  async getStatus(_id: string) {
    const task = await this.findOne(_id);
    return { status: task.status };
  }

  async getResult(_id: string) {
    const task = await this.findOne(_id);
    return { result: task.result };
  }

  async pauseTask(_id: string) {
    const task = await this.findOne(_id);

    if (task) {
      // BullMq does not have a way of stopping jobs in progress to to pause the task i am removing from the queue and updating ths state in the DB to paused.
      const job: Job | null = await this.taskQueue.getJob(_id);

      if (job) {
        const state = await job.getState();

        if (state !== 'completed' && state !== 'failed') {
          await job.remove();
          await this.update(_id, { status: STATUS.paused });

          return { message: `Task ${_id} paused` };
        }

        throw new BadRequestException(
          `Task with this id - ${_id} already completed`,
        );
      }
    }
  }

  async resumeTask(_id: string) {
    const task = await this.findOne(_id);

    if (task) {
      const job: Job | null = await this.taskQueue.getJob(_id);

      if (!job) {
        await this.runTask(_id);
        return { message: `Task ${_id} resumed` };
      }
    }
  }
}
