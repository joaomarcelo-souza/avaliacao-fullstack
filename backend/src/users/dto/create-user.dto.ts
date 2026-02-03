import { IsString, IsEmail, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a user.
 * Validation rules are enforced via class-validator decorators.
 */
export class CreateUserDto {
  /** Full name: letters and spaces only */
  @ApiProperty({
    description: 'Nome completo do usuário (somente letras e espaços)',
    example: 'João Silva',
  })
  @IsString()
  @Matches(/^[A-Za-zÀ-ÿ ]+$/, {
    message: 'O nome deve conter apenas letras e espaços',
  })
  name: string;

  /** Unique email for the user */
  @ApiProperty({
    description: 'Email do usuário (único)',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  email: string;

  /** Numeric registration number / matricula */
  @ApiProperty({
    description: 'Matrícula do usuário (somente números)',
    example: '123456',
  })
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'A matrícula deve conter apenas números',
  })
  matricula: string;

  /** Password: exactly 6 alphanumeric characters */
  @ApiProperty({
    description: 'Senha do usuário (exatamente 6 caracteres alfanuméricos)',
    example: 'Abc123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^[A-Za-z0-9]{6}$/, {
    message: 'A senha deve ter exatamente 6 caracteres alfanuméricos',
  })
  password: string;
}