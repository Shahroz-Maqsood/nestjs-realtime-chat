import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';
import { JwtPayload } from '../common/types/jwt-payload';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private typingUsers = new Map<string, Set<string>>(); // roomId -> Set(userId)

  constructor(
    private chat: ChatService,
    private users: UsersService,
    private rooms: RoomsService,
    private jwtService: JwtService,
  ) { }

  afterInit(server: Server) {
    server.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new WsException('Authentication error: token missing'));
      }

      try {
        const jwt = token.startsWith('Bearer ') ? token.slice(7) : token;
        const payload = this.jwtService.verify(jwt);
        socket.data.user = payload;
        next();
      } catch (err) {
        return next(new WsException('Authentication error: invalid token'));
      }
    });
  }

  async handleConnection(client: Socket) {
    const userId = (client.data.user as JwtPayload).sub as string;
    await this.users.setOnline(userId, true);
    this.server.emit('user_online', { userId });
  }

  async handleDisconnect(client: Socket) {
    const user = client.data.user as JwtPayload | undefined;
    const userId = user?.sub as string;
    if (userId) {
      await this.users.setOnline(userId, false);
      this.server.emit('user_offline', { userId });
    }
  }

  @SubscribeMessage('join_room')
  async onJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
    const { roomId } = body;
    await this.rooms.addParticipant(roomId, (client.data.user as JwtPayload).sub);
    await client.join(roomId);
    return { ok: true };
  }

  @SubscribeMessage('leave_room')
  async onLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
    const { roomId } = body;
    await this.rooms.removeParticipant(roomId, (client.data.user as JwtPayload).sub);
    await client.leave(roomId);
    return { ok: true };
  }

  @SubscribeMessage('send_message')
  async onSendMessage(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
    const { roomId, content } = body;
    const user = client.data.user as JwtPayload;
    const message = await this.chat.saveMessage(roomId, user.sub, content);
    this.server.to(roomId).emit('receive_message', {
      _id: message._id,
      room: message.room,
      sender: { _id: user.sub, name: user.name },
      content: message.content,
      createdAt: message.createdAt,
    });
    return { ok: true };
  }

  @SubscribeMessage('typing')
  async onTyping(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
    const { roomId, isTyping } = body as { roomId: string; isTyping: boolean };
    const set = this.typingUsers.get(roomId) || new Set<string>();
    const user = client.data.user as JwtPayload;
    if (isTyping) set.add(user.sub);
    else set.delete(user.sub);
    this.typingUsers.set(roomId, set);
    client.to(roomId).emit('typing', { roomId, userId: user.sub, isTyping });
    return { ok: true };
  }
}
