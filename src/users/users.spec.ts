import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from './role.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw conflict exception if username already exists', async () => {
      mockUsersRepository.findOne.mockResolvedValue({ username: 'testuser' });

      await expect(
        service.createUser('testuser', 'test@example.com', 'password'),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and return a new user', async () => {
      const mockUser = {
        id: 'test-id',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.USER,
      };

      mockUsersRepository.findOne.mockResolvedValue(null);
      mockUsersRepository.create.mockReturnValue(mockUser);
      mockUsersRepository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(
        'testuser',
        'test@example.com',
        'password',
      );

      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.create).toHaveBeenCalled();
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should throw not found exception when user does not exist', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a user if found', async () => {
      const mockUser = {
        id: 'test-id',
        username: 'testuser',
        email: 'test@example.com',
      };
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('test-id');
      expect(result).toEqual(mockUser);
    });
  });
});