import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MessageModule } from './message/message.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, //1min
        limit: 1000,
      },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    MessageModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
