import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.team.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}
