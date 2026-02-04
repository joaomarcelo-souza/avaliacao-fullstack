import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEmail, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for partial updates of a user. Inherits validations from CreateUserDto
 * but makes all fields optional.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /** Optional full name */
  @ApiPropertyOptional({
    description: 'Nome completo do usuário (somente letras e espaços)',
    example: 'João da Silva',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zÀ-ÿ ]+$/, {
    message: 'O nome deve conter apenas letras e espaços',
  })
  name?: string;

  /** Optional email */
  @ApiPropertyOptional({
    description: 'Email do usuário (único)',
    example: 'joao.silva.novo@email.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  /** Optional matricula */
  @ApiPropertyOptional({
    description: 'Matrícula do usuário (somente números)',
    example: '654321',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'A matrícula deve conter apenas números',
  })
  matricula?: string;

  /** Optional password (exactly 6 alphanumeric characters) */
  @ApiPropertyOptional({
    description: 'Senha do usuário (exatamente 6 caracteres alfanuméricos)',
    example: 'Xyz789',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^[A-Za-z0-9]{6}$/, {
    message: 'A senha deve ter exatamente 6 caracteres alfanuméricos',
  })
  password?: string;
}