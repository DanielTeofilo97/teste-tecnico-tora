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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Roles(Role.Leader)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  @ApiOperation({ summary: 'Criar mensagem' })
  @ApiResponse({ status: 201, description: 'Mensagem criada' })
  @ApiResponse({
    status: 400,
    description: 'Erro ao criar mensagem',
  })
  @ApiResponse({ status: 403, description: 'Sem acesso ao recurso' })
  @ApiTags('messages')
  create(@Req() req, @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(req.user.team_id, createMessageDto);
  }

  @Roles(Role.Collaborator)
  @UseGuards(AuthGuard, RoleGuard)
  @Get('/random')
  @ApiOperation({ summary: 'Buscar mensagem aleátoria' })
  @ApiResponse({ status: 200, description: 'mensagem retornada' })
  @ApiResponse({
    status: 400,
    description: 'Erro ao buscar mensagem',
  })
  @ApiResponse({ status: 403, description: 'Sem acesso ao recurso' })
  @ApiTags('messages')
  random(@Req() req) {
    return this.messageService.random(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Buscar mensagens' })
  @ApiResponse({ status: 200, description: 'mensagens retornada' })
  @ApiResponse({
    status: 400,
    description: 'Erro ao buscar mensagens',
  })
  @ApiResponse({ status: 403, description: 'Sem acesso ao recurso' })
  @ApiTags('messages')
  findAll(@Req() req) {
    return this.messageService.findAll(req.user.team_id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar mensagem por id' })
  @ApiResponse({ status: 200, description: 'mensagem retornada' })
  @ApiResponse({
    status: 400,
    description: 'Erro ao buscar mensagem',
  })
  @ApiResponse({ status: 403, description: 'Sem acesso ao recurso' })
  @ApiTags('messages')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Roles(Role.Leader)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar mensagem pelo id' })
  @ApiResponse({ status: 200, description: 'mensagem atualizada' })
  @ApiResponse({
    status: 400,
    description: 'Erro ao atualizar mensagem',
  })
  @ApiResponse({ status: 403, description: 'Sem acesso ao recurso' })
  @ApiTags('messages')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Roles(Role.Leader)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Apagar mensagem' })
  @ApiResponse({ status: 200, description: 'mensagem deletada' })
  @ApiResponse({
    status: 400,
    description: 'Erro ao deletar mensagem',
  })
  @ApiResponse({ status: 403, description: 'Sem acesso ao recurso' })
  @ApiTags('messages')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
