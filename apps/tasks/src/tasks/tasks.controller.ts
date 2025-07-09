import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post('/run/:id')
  runTask(@Param('id') id: string) {
    return this.tasksService.runTask(id);
  }

  @Get(':id/status')
  getStatus(@Param('id') id: string) {
    return this.tasksService.getStatus(id);
  }

  @Get(':id/result')
  getResult(@Param('id') id: string) {
    return this.tasksService.getResult(id);
  }

  @Post(':id/pause')
  pauseTask(@Param('id') id: string) {
    return this.tasksService.pauseTask(id);
  }

  @Post(':id/resume')
  resumeTask(@Param('id') id: string) {
    return this.tasksService.resumeTask(id);
  }
}
