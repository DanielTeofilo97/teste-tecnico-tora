import { IsString, MinLength } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class AuthLoginDTO {
  @IsCPF()
  cpf: string;

  @IsString()
  @MinLength(8)
  password: string;
}
