import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
