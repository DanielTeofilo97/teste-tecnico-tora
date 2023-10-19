import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() { cpf, password }: AuthLoginDTO) {
    return this.authService.login(cpf, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }
}
