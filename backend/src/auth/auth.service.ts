import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private audience = 'users';
  private issuer = 'login';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  createToken(user: any) {
    return {
      user,
      token: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: user.id,
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(cpf: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        cpf,
      },
      select: {
        id: true,
        name: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha incorretos.');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email e/ou senha incorretos.');
    }

    delete user.password;

    return this.createToken(user);
  }

  async forget(cpf: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        cpf,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email incorreto.');
    }
    //TODO: Enviar email...
    return true;
  }

  async reset(password: string, token: string) {
    //TODO: Verificar Token

    const id = 'asdasd';
    console.log(token);

    const user = await this.prisma.user.update({
      data: {
        password,
      },
      where: {
        id: id,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        cpf: data.cpf,
      },
    });

    if (userExists) {
      throw new BadRequestException('CPF já cadastrado.');
    }

    const user = await this.userService.create(data);

    const userCreated = await this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });

    return this.createToken(userCreated);
  }
}
