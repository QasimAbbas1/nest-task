import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Role } from '../users/role.enum';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  const mockTasksRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const regularUser = {
    id: 'user-id',
    username: 'testuser',
    role: Role.USER,
  };

  const adminUser = {
    id: 'admin-id',
    username: 'admin',
    role: Role.ADMIN,
  };

  const mockTask = {
    id: 'task-id',
    title: 'Test task',
    description: 'Task description',
    status: TaskStatus.OPEN,
    userId: 'user-id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTasks', () => {
    it('should return all tasks for admin user', async () => {
      const mockTasks = [mockTask];
      mockTasksRepository.find.mockResolvedValue(mockTasks);

      const result = await service.getAllTasks(adminUser);
      expect(result).toEqual(mockTasks);
      expect(mockTasksRepository.find).toHaveBeenCalledWith();
    });

    it('should return only user tasks for regular user', async () => {
      const mockTasks = [mockTask];
      mockTasksRepository.find.mockResolvedValue(mockTasks);

      const result = await service.getAllTasks(regularUser);
      expect(result).toEqual(mockTasks);
      expect(mockTasksRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
      });
    });
  });

  describe('getTaskById', () => {
    it('should throw NotFoundException when task does not exist', async () => {
      mockTasksRepository.findOne.mockResolvedValue(null);

      await expect(service.getTaskById('non-existent-id', regularUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when regular user tries to access another user task', async () => {
      const otherUserTask = { ...mockTask, userId: 'other-user-id' };
      mockTasksRepository.findOne.mockResolvedValue(otherUserTask);

      await expect(service.getTaskById('task-id', regularUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return task for admin user', async () => {
      const otherUserTask = { ...mockTask, userId: 'other-user-id' };
      mockTasksRepository.findOne.mockResolvedValue(otherUserTask);

      const result = await service.getTaskById('task-id', adminUser);
      expect(result).toEqual(otherUserTask);
    });

    it('should return task for the task owner', async () => {
      mockTasksRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.getTaskById('task-id', regularUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      mockTasksRepository.create.mockReturnValue(mockTask);
      mockTasksRepository.save.mockResolvedValue(mockTask);

      const result = await service.createTask(
        'Test task',
        'Task description',
        regularUser,
      );

      expect(result).toEqual(mockTask);
      expect(mockTasksRepository.create).toHaveBeenCalledWith({
        title: 'Test task',
        description: 'Task description',
        userId: 'user-id',
        status: TaskStatus.OPEN,
      });
      expect(mockTasksRepository.save).toHaveBeenCalled();
    });
  });
});