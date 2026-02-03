import { IsString, IsEmail, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for user authentication.
 * Identifier may be an email or matricula.
 */
export class LoginUserDto {
  /** Email or registration (matricula) used as login identifier */
  @ApiProperty({
    description: 'Email ou matrícula do usuário',
    example: 'joao.silva@email.com',
  })
  @IsString()
  identifier: string; // Can be email or matricula

  /** Plaintext password - exactly 6 alphanumeric characters */
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