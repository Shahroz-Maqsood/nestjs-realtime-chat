import { Test } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<any>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: { find: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) } },
      ],
    }).compile();
    service = module.get(UsersService);
    model = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns array', async () => {
    const res = await service.findAll();
    expect(Array.isArray(res)).toBe(true);
  });
});
