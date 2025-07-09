import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@QueueEventsListener('task')
export class TaskQueueEventsListener extends QueueEventsHost {
  protected readonly logger = new Logger(TaskQueueEventsListener.name);

  @OnQueueEvent('added')
  onAdded(job: Job) {
    const { id, queueName } = job;

    this.logger.log(`Job ${id} has been added to the queue ${queueName}`);
  }

  @OnQueueEvent('removed')
  onRemove(job: Job) {
    const { id, queueName } = job;
    this.logger.log(`Job ${id} has been removed to the queue ${queueName}`);
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`,
    );
  }

  @OnQueueEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnQueueEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnQueueEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }

  @OnQueueEvent('paused')
  onPaused(job: Job) {
    const { id, name, queueName } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} paused in queue ${queueName}.`,
    );
  }
}
