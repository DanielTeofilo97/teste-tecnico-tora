import { IsCPF } from 'class-validator-cpf';

export class AuthForgetDTO {
  @IsCPF()
  cpf: string;
}
