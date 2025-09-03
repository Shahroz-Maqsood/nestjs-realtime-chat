import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';

@ApiTags('rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private rooms: RoomsService) { }

  @Get()
  list() {
    return this.rooms.findAll();
  }

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateRoomDto, @Req() req: any) {
    return this.rooms.create(dto, req.user.sub);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.rooms.remove(id, req.user.sub, req.user.role);
  }
}
