import { IsString, MinLength } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class AuthLoginDTO {
  @IsCPF({
    message: 'CPF inválido!',
  })
  cpf: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter mais ou igual a 8 caracteres' })
  password: string;
}
