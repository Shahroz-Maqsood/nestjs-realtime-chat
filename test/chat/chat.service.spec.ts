import { Test } from '@nestjs/testing';
import { ChatService } from '../../src/chat/chat.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ChatService', () => {
  it('getHistory returns array', async () => {
    const mockModel = {
      find: () => ({ sort: () => ({ skip: () => ({ limit: () => ({ populate: () => ({ lean: () => [] }) }) }) }) }),
    };
    const module = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: getModelToken('Message'), useValue: mockModel },
      ],
    }).compile();
    const service = module.get(ChatService);
    const res = await service.getHistory('1', 10, 0);
    expect(Array.isArray(res)).toBe(true);
  });

  it('saveMessage calls save', async () => {
    const save = jest.fn().mockResolvedValue({ _id: '1' });
    const ctor = function(this: any, obj: any){ Object.assign(this, obj); this.save = save; } as any;
    const module = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: getModelToken('Message'), useValue: ctor },
      ],
    }).compile();
    const service = module.get(ChatService);
    const res = await service.saveMessage('r', 'u', 'hi');
    expect(res._id).toBe('1');
  });
});
