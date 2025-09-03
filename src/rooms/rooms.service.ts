import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from './room.schema';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(dto: CreateRoomDto, adminId: string) {
    const room = new this.roomModel({ ...dto, createdBy: new Types.ObjectId(adminId) });
    return room.save();
  }

  async findAll() {
    return this.roomModel.find().populate('createdBy', 'name email').lean();
  }

  async findOne(id: string) {
    const room = await this.roomModel.findById(id).lean();
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async remove(id: string, requesterId: string, requesterRole: 'user' | 'admin') {
    const room = await this.roomModel.findById(id);
    if (!room) throw new NotFoundException('Room not found');
    if (requesterRole !== 'admin' && room.createdBy.toString() !== requesterId) {
      throw new ForbiddenException('Only admins or creator can delete room');
    }
    await room.deleteOne();
  }

  async addParticipant(roomId: string, userId: string) {
    await this.roomModel.findByIdAndUpdate(roomId, { $addToSet: { participants: userId } });
  }

  async removeParticipant(roomId: string, userId: string) {
    await this.roomModel.findByIdAndUpdate(roomId, { $pull: { participants: userId } });
  }
}
