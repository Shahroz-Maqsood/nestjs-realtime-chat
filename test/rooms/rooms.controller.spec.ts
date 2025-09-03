import { Test } from '@nestjs/testing';
import { RoomsController } from '../../src/rooms/rooms.controller';
import { RoomsService } from '../../src/rooms/rooms.service';

describe('RoomsController', () => {
  it('list returns rooms', async () => {
    const rooms = { findAll: jest.fn().mockResolvedValue([{ name: 'general' }]) } as any;
    const module = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [{ provide: RoomsService, useValue: rooms }],
    }).compile();
    const ctrl = module.get(RoomsController);
    const res = await ctrl.list();
    expect(res[0].name).toBe('general');
  });

  it('create uses requester', async () => {
    const rooms = { create: jest.fn().mockResolvedValue({ name: 'x' }) } as any;
    const module = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [{ provide: RoomsService, useValue: rooms }],
    }).compile();
    const ctrl = module.get(RoomsController);
    const res = await ctrl.create({ name: 'x' } as any, { user: { sub: '1' } } as any);
    expect(res.name).toBe('x');
  });
});
