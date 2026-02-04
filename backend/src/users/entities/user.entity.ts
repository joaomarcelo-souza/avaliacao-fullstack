import { Entity, PrimaryGeneratedColumn, Column, Unique, Check } from 'typeorm';

/**
 * Database entity that represents a user.
 *
 * Constraints are enforced at the DB level:
 * - email must be unique
 * - name must match the letters-and-spaces regex
 * - matricula must be numeric
 * - password will be stored as a bcrypt hash (DB-level check removed)
 */
@Entity('users')
@Unique(['email'])
@Check(`"name" ~ '^[A-Za-zÀ-ÿ ]+$'`)
@Check(`"matricula" ~ '^[0-9]+$'`)
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

  /** Password (stored as a bcrypt hash) */
  @Column()
  password: string;
}
