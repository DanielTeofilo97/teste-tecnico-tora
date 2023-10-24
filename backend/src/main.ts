import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/log.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API FJ Company')
    .setDescription('API REST desenvolvido com NestJs e Postgresql')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('messages')
    .addTag('teams')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LogInterceptor());
  await app.listen(process.env.PORT || 3000);
  console.log('>> Servidor Rodando... PORTA : ', process.env.PORT || 3001);
}
bootstrap();
