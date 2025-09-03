import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Room } from 'src/rooms/room.schema';
import { User } from 'src/users/user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: () => Room.name, required: true })
  room: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: () => User.name, required: true })
  sender: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: () => User.name }], default: [] })
  readBy: Types.ObjectId[];

  // Added by Mongoose when using timestamps: true
  createdAt?: Date;
  updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
