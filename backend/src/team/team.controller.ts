import { Controller, Get } from '@nestjs/common';
import { TeamService } from './team.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: 'Buscar equipes' })
  @ApiResponse({ status: 200, description: 'Listagem das equipes.' })
  @ApiResponse({ status: 404, description: 'Nenhuma equipe encontrada.' })
  @ApiTags('teams')
  @Get()
  findAll() {
    return this.teamService.findAll();
  }
}
