import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private toResponse(user: User): ResponseUserDto {
    const { password, ...rest } = user as any;
    return rest as ResponseUserDto;
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = this.usersRepository.create(createUserDto);
    const saved = await this.usersRepository.save(user);
    return this.toResponse(saved);
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.usersRepository.find();
    return users.map((u) => this.toResponse(u));
  }

  async findOne(id: number): Promise<ResponseUserDto> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return this.toResponse(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return;
  }

  async login(loginUserDto: LoginUserDto): Promise<ResponseUserDto> {
    const { identifier, password } = loginUserDto;

    let user = await this.usersRepository.findOneBy({ email: identifier });
    if (!user) user = await this.usersRepository.findOneBy({ matricula: identifier });

    if (!user) throw new NotFoundException('User not found');
    if (user.password !== password) throw new UnauthorizedException('Invalid credentials');

    return this.toResponse(user);
  }
}
