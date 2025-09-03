import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private chat: ChatService) {}

  @Get('rooms/:roomId/history')
  history(
    @Param('roomId') roomId: string,
    @Query('limit') limit = '50',
    @Query('skip') skip = '0',
  ) {
    return this.chat.getHistory(roomId, Number(limit), Number(skip));
  }
}
