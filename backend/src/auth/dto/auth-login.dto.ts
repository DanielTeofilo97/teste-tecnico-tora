import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthLoginDTO {
  @IsEmail()
  cpf: string;

  @IsString()
  @MinLength(8)
  password: string;
}
