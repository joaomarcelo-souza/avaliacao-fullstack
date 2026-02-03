import { Entity, PrimaryGeneratedColumn, Column, Unique, Check } from 'typeorm';

@Entity('users')
@Unique(['email'])
@Check(`"name" ~ '^[A-Za-zÀ-ÿ ]+$'`)
@Check(`"matricula" ~ '^[0-9]+$'`)
@Check(`"password" ~ '^[A-Za-z0-9]{6}$'`)
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  matricula: string;

  @Column()
  password: string;
}
