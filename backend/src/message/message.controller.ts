import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Roles(Role.Leader)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Req() req, @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(req.user.team_id, createMessageDto);
  }

  @Roles(Role.Collaborator)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/random')
  random(@Req() req) {
    return this.messageService.random(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.messageService.findAll(req.user.team_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Roles(Role.Leader)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Roles(Role.Leader)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
