import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  startOfDay,
  endOfDay,
  addDays,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
} from 'date-fns';
import { utcToZonedTime, format } from 'date-fns-tz';
import { AdviceService } from 'src/providers/advice.service';
import { AdviceDto } from 'src/providers/dtos/advice.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly adviceService: AdviceService,
  ) {}
  create(team_id: number, createMessageDto: CreateMessageDto) {
    return this.prisma.teamMessage.create({
      data: {
        team_id,
        message: createMessageDto.message,
      },
    });
  }

  async findAll(team_id: number) {
    const messages = await this.prisma.teamMessage.findMany({
      where: {
        team_id,
      },
    });
    if (messages.length > 0) {
      return messages;
    } else {
      throw new BadRequestException(
        'Solicitar ao líder da equipe o cadastro de uma mensagem',
      );
    }
  }

  async random(user_id: string) {
    const targetTimeZone = 'Etc/GMT';
    const nowInTargetZone = utcToZonedTime(new Date(), targetTimeZone);
    const startOfToday = startOfDay(nowInTargetZone);
    const endOfToday = endOfDay(nowInTargetZone);
    const startFormatted = format(startOfToday, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: targetTimeZone,
    });
    const endFormatted = format(endOfToday, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: targetTimeZone,
    });
    const count = await this.prisma.randomMessage.count({
      where: {
        user_id: user_id,
        createdAt: {
          gte: startFormatted,
          lte: endFormatted,
        },
      },
    });

    const lastRandomMessage = await this.prisma.randomMessage.findFirst({
      where: {
        user_id: user_id,
        createdAt: {
          gte: startFormatted,
          lte: endFormatted,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (count >= 4) {
      const timeZone = 'America/Sao_Paulo';
      const now = utcToZonedTime(new Date(), timeZone);
      const nextDay = startOfDay(addDays(now, 1));
      throw new BadRequestException({
        message: `O limite diário de mensagens aleátorias expiraram volte em ${differenceInHours(
          nextDay,
          now,
        )}:${differenceInMinutes(nextDay, now) % 60}:${
          differenceInSeconds(nextDay, now) % 60
        }`,
      });
    } else {
      try {
        let advice: AdviceDto;
        if (lastRandomMessage) {
          let same_message = true;
          while (same_message) {
            advice = await this.adviceService.getRandomAdvice();
            if (advice.slip.id.toString() != lastRandomMessage.api_id)
              same_message = false;
          }
        } else {
          advice = await this.adviceService.getRandomAdvice();
        }
        await this.prisma.randomMessage.create({
          data: {
            user_id: user_id,
            message: advice.slip.advice,
            api_id: advice.slip.id.toString(),
          },
        });
        return {
          message: advice.slip.advice,
        };
      } catch (error) {
        throw new BadRequestException('Erro ao buscar mensagem aleátoria');
      }
    }
  }

  findOne(id: string) {
    return this.prisma.teamMessage.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.prisma.teamMessage.update({
      where: {
        id,
      },
      data: updateMessageDto,
    });
  }

  remove(id: string) {
    return this.prisma.teamMessage.delete({
      where: {
        id,
      },
    });
  }
}
