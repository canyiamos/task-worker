import { STATUS } from '@app/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsNumber()
  result?: number;

  @IsOptional()
  @IsEnum(STATUS)
  status?: STATUS;

  @IsOptional()
  @IsNumber()
  progress?: number;
}
