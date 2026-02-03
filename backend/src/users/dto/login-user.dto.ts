import { IsString, IsEmail, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email ou matrícula do usuário',
    example: 'joao.silva@email.com',
  })
  @IsString()
  identifier: string; // Pode ser email ou matrícula

  @ApiProperty({
    description: 'Senha do usuário',
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