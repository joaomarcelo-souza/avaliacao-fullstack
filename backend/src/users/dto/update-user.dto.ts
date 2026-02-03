import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEmail, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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

  @ApiPropertyOptional({
    description: 'Email do usuário (único)',
    example: 'joao.silva.novo@email.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

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