import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO returned by API endpoints when exposing user data.
 * Note: This DTO intentionally omits the password field.
 */
export class ResponseUserDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Matrícula do usuário',
    example: '123456',
  })
  matricula: string;
}