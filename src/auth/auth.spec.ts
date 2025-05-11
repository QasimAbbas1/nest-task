import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'test-id',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
  };

  const mockUsersService = {
    findOne: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should throw UnauthorizedException when invalid credentials are provided', async () => {
      // Mock validateUser to return null (invalid credentials)
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(authService.login('invalid', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register a new user and return token and user info', async () => {
      mockUsersService.createUser.mockResolvedValue(mockUser);

      const result = await authService.register('testuser', 'test@example.com', 'password');

      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        'testuser',
        'test@example.com',
        'password',
      );
      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('testuser');
    });
  });
});