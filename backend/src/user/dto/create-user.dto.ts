import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';
import { Role } from 'src/enums/role.enum';

export class CreateUserDTO {
  @IsString({
    message: 'name deve ser uma cadeia de caracteres',
  })
  name: string;

  @IsCPF({
    message: 'CPF inválido!',
  })
  cpf: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter mais ou igual a 8 caracteres' })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: number;

  @IsOptional()
  team_id: number;
}
