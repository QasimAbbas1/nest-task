import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Role } from '../users/role.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getAllTasks(user: any): Promise<Task[]> {
    // Admin can see all tasks, regular users see only their own
    if (user.role === Role.ADMIN) {
      return this.tasksRepository.find();
    } else {
      return this.tasksRepository.find({ where: { userId: user.id } });
    }
  }

  async getTaskById(id: string, user: any): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Check if user is authorized to access this task
    if (user.role !== Role.ADMIN && task.userId !== user.id) {
      throw new ForbiddenException('You are not authorized to access this task');
    }

    return task;
  }

  async createTask(
    title: string,
    description: string,
    user: any,
  ): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      description,
      userId: user.id,
      status: TaskStatus.OPEN,
    });

    return this.tasksRepository.save(task);
  }

  async updateTask(
    id: string,
    title: string,
    description: string,
    status: TaskStatus,
    user: any,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    return this.tasksRepository.save(task);
  }

  async deleteTask(id: string, user: any): Promise<void> {
    const task = await this.getTaskById(id, user);
    await this.tasksRepository.remove(task);
  }
}