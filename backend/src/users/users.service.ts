import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Service that encapsulates business logic related to users.
 *
 * Responsibilities:
 * - CRUD operations for User entities
 * - Authentication (simple credential check)
 * - Convert entity to DTO (removing sensitive fields)
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Helper: Convert a User entity to a response DTO.
   * Removes sensitive fields (password) before returning.
   *
   * @param user - User entity instance
   * @returns ResponseUserDto without password
   */
  private toResponse(user: User): ResponseUserDto {
    const { password, ...rest } = user as any;
    return rest as ResponseUserDto;
  }

  /**
   * Create a new user record.
   * @param createUserDto - data required to create a user
   * @returns created user mapped to ResponseUserDto
   */
  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    // Hash password before saving
    const hashed = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({ ...createUserDto, password: hashed });
    const saved = await this.usersRepository.save(user);
    return this.toResponse(saved);
  }

  /**
   * Retrieve all users.
   * @returns list of users mapped to ResponseUserDto
   */
  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.usersRepository.find();
    return users.map((u) => this.toResponse(u));
  }

  /**
   * Find a single user by ID.
   * Throws NotFoundException if user does not exist.
   *
   * @param id - numeric user id
   * @returns user mapped to ResponseUserDto
   */
  async findOne(id: number): Promise<ResponseUserDto> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return this.toResponse(user);
  }

  /**
   * Update a user's properties.
   * Returns the updated user.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    // If password is being updated, hash it first
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  /**
   * Remove a user by ID.
   * Throws NotFoundException if no rows were affected.
   */
  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return;
  }

  /**
   * Authenticate a user using either email or matricula and a password.
   * Note: Currently compares plaintext passwords — replace with hashed comparison.
   *
   * @param loginUserDto - contains identifier (email|matricula) and password
   * @returns authenticated user mapped to ResponseUserDto
   */
  async login(loginUserDto: LoginUserDto): Promise<ResponseUserDto> {
    const { identifier, password } = loginUserDto;

    // Try email first, then fallback to matricula
    let user = await this.usersRepository.findOneBy({ email: identifier });
    if (!user) user = await this.usersRepository.findOneBy({ matricula: identifier });

    if (!user) throw new NotFoundException('User not found');

    // Compare plaintext password with stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return this.toResponse(user);
  }
}
