import { Test } from '@nestjs/testing';
import { RoomsService } from '../../src/rooms/rooms.service';
import { getModelToken } from '@nestjs/mongoose';

describe('RoomsService', () => {
  it('findAll returns array', async () => {
    const module = await Test.createTestingModule({
      providers: [
        RoomsService,
        { provide: getModelToken('Room'), useValue: { find: () => ({ populate: () => ({ lean: () => [] }) }) } },
      ],
    }).compile();
    const service = module.get(RoomsService);
    const res = await service.findAll();
    expect(Array.isArray(res)).toBe(true);
  });

  it('add/remove participant do not throw', async () => {
    const updateMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        RoomsService,
        { provide: getModelToken('Room'), useValue: { findByIdAndUpdate: updateMock } },
      ],
    }).compile();
    const service = module.get(RoomsService);
    await service.addParticipant('1', '2');
    await service.removeParticipant('1', '2');
    expect(updateMock).toBeCalled();
  });
});
