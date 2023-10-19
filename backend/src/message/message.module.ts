import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdviceService } from 'src/providers/advice.service';

@Module({
  imports: [UserModule, AuthModule, PrismaModule],
  controllers: [MessageController],
  providers: [MessageService, AdviceService],
})
export class MessageModule {}
