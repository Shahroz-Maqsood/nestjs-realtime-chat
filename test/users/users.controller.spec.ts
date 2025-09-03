import { Test } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';

describe('UsersController', () => {
  it('me returns user', async () => {
    const users = { findOne: jest.fn().mockResolvedValue({ _id: '1', email: 'a@a.com' }) } as any;
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: users }],
    }).compile();
    const ctrl = module.get(UsersController);
    const res = await ctrl.me({ user: { sub: '1' } } as any);
    expect(res.email).toBe('a@a.com');
  });
});
