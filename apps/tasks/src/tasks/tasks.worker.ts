import { STATUS } from '@app/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';

const fib = (num: number): number => {
  if (num <= 1) {
    return num;
  }
  let a = 0;
  let b = 1;
  for (let i = 2; i <= num; i++) {
    [a, b] = [b, a + b];
  }
  return b;
};

@Processor('task', { concurrency: 3 })
export class TaskProcessor extends WorkerHost {
  constructor(private readonly tasksService: TasksService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'run/add': {
        const result = await new Promise((resolve, reject) => {
          setTimeout(
            () => {
              try {
                const { a, b } = job.data;
                if (
                  typeof a !== 'number' ||
                  typeof b !== 'number' ||
                  [a, b].some((d) => !Number.isInteger(d))
                ) {
                  return reject(
                    new Error('Invalid input. "a" and "b" must be an integer.'),
                  );
                }

                resolve(a + b);
              } catch (error) {
                reject(error);
              }
            },
            15000 + Math.floor(Math.random() * 5000),
          );
        });
        return result;
      }

      // Simulate log running task
      case 'run/fib': {
        const result = await new Promise((resolve, reject) => {
          setTimeout(
            () => {
              try {
                const { n } = job.data;
                if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
                  return reject(
                    new Error(
                      'Invalid input for fibonacci. "n" must be a non-negative integer.',
                    ),
                  );
                }

                resolve(fib(n));
              } catch (error) {
                reject(error);
              }
            },
            10000 + Math.floor(Math.random() * 5000),
          );
        });
        return result;
      }
    }
    throw new BadRequestException(`Unknown job name: ${job.name}`);
  }

  @OnWorkerEvent('active')
  async onActive(job: Job) {
    if (job.id) {
      await this.tasksService.update(job.id, { status: STATUS.active });
    }
  }

  @OnWorkerEvent('progress')
  async onProgress(job: Job) {
    if (job.id) {
      await this.tasksService.update(job.id, {
        progress: job.progress as number,
      });
    }
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    if (job.id) {
      await this.tasksService.update(job.id, {
        status: STATUS.completed,
        result: job.returnvalue as number,
      });
    }
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    if (job.id && job.attemptsMade === 3) {
      await this.tasksService.update(job.id, { status: STATUS.failed });
    }
  }
}
