import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private msgModel: Model<MessageDocument>) {}

  async saveMessage(roomId: string, userId: string, content: string) {
    const msg = new this.msgModel({
      room: new Types.ObjectId(roomId),
      sender: new Types.ObjectId(userId),
      content,
    });
    return msg.save();
  }

  getHistory(roomId: string, limit = 50, skip = 0) {
    return this.msgModel
      .find({ room: roomId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name email')
      .lean();
  }
}
