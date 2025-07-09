import { IsObject, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  taskType: string;

  @IsObject()
  payload: Record<string, number>;
}
