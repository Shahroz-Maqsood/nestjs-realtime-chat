import { Test } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  it('login fails with invalid user', async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: { findByEmail: jest.fn().mockResolvedValue(null) } },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('token') } },
      ],
    }).compile();
    const service = module.get(AuthService);
    await expect(service.login('x@x.com', 'pass')).rejects.toBeDefined();
  });

  it('signup returns token', async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: { create: jest.fn().mockResolvedValue({ _id: '1', email: 'a@a.com', role: 'user', name: 'A' }) } },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('token') } },
      ],
    }).compile();
    const service = module.get(AuthService);
    const res = await service.signup('a@a.com', 'A', 'secret');
    expect(res.token).toBe('token');
  });
});
