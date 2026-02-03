import { Entity, PrimaryGeneratedColumn, Column, Unique, Check } from 'typeorm';

/**
 * Database entity that represents a user.
 *
 * Constraints are enforced at the DB level:
 * - email must be unique
 * - name must match the letters-and-spaces regex
 * - matricula must be numeric
 * - password must be exactly 6 alphanumeric chars (current requirement)
 */
@Entity('users')
@Unique(['email'])
@Check(`"name" ~ '^[A-Za-zÀ-ÿ ]+$'`)
@Check(`"matricula" ~ '^[0-9]+$'`)
@Check(`"password" ~ '^[A-Za-z0-9]{6}$'`)
export class User {
  /** Primary key */
  @PrimaryGeneratedColumn()
  id: number;

  /** Full name */
  @Column()
  name: string;

  /** Unique email address */
  @Column()
  email: string;

  /** Numeric registration / matricula */
  @Column()
  matricula: string;

  /** Password (stored as plaintext for now) */
  @Column()
  password: string;
}
