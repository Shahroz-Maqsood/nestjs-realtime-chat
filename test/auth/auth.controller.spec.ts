import { Test } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthController', () => {
  it('login passes dto to service', async () => {
    const auth = { login: jest.fn().mockResolvedValue({ token: 't' }) } as any;
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compile();
    const ctrl = module.get(AuthController);
    const res = await ctrl.login({ email: 'e', password: 'p' } as any);
    expect(res.token).toBe('t');
  });

  it('signup calls service', async () => {
    const auth = { signup: jest.fn().mockResolvedValue({ token: 't' }) } as any;
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: auth }],
    }).compile();
    const ctrl = module.get(AuthController);
    const res = await ctrl.signup({ email: 'e', name: 'n', password: 'p' } as any);
    expect(res.token).toBe('t');
  });
});
