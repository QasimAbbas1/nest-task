import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards,
    Request,
    ValidationPipe,
  } from '@nestjs/common';
  import { TasksService } from './tasks.service';
  import { Task } from './task.entity';
  import { TaskStatus } from './task-status.enum';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
  
  class CreateTaskDto {
    @IsNotEmpty()
    title: string;
  
    @IsNotEmpty()
    description: string;
  }
  
  class UpdateTaskDto {
    @IsOptional()
    title?: string;
  
    @IsOptional()
    description?: string;
  
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
  }
  
  @Controller('tasks')
  @UseGuards(JwtAuthGuard)
  export class TasksController {
    constructor(private tasksService: TasksService) {}
  
    @Get()
    getAllTasks(@Request() req): Promise<Task[]> {
      return this.tasksService.getAllTasks(req.user);
    }
  
    @Get(':id')
    getTaskById(@Param('id') id: string, @Request() req): Promise<Task> {
      return this.tasksService.getTaskById(id, req.user);
    }
  
    @Post()
    createTask(
      @Body(ValidationPipe) createTaskDto: CreateTaskDto,
      @Request() req,
    ): Promise<Task> {
      return this.tasksService.createTask(
        createTaskDto.title,
        createTaskDto.description,
        req.user,
      );
    }
  
    @Patch(':id')
    updateTask(
      @Param('id') id: string,
      @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
      @Request() req,
    ): Promise<Task> {
      return this.tasksService.updateTask(
        id,
        updateTaskDto.title,
        updateTaskDto.description,
        updateTaskDto.status,
        req.user,
      );
    }
  
    @Delete(':id')
    deleteTask(@Param('id') id: string, @Request() req): Promise<void> {
      return this.tasksService.deleteTask(id, req.user);
    }
  }