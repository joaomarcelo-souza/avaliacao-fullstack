import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

/**
 * Controller that exposes REST endpoints for user management.
 * All endpoints delegate business logic to UsersService.
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Create a new user.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: ResponseUserDto })
  @ApiBadRequestResponse()
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.create(createUserDto);
  }

  /**
   * POST /users/login
   * Authenticate a user using email or matricula.
   */
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user by email or matricula' })
  @ApiOkResponse({ type: ResponseUserDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  login(@Body() loginUserDto: LoginUserDto): Promise<ResponseUserDto> {
    return this.usersService.login(loginUserDto);
  }

  /**
   * GET /users
   * Retrieve all users (passwords are omitted in the response DTO).
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [ResponseUserDto] })
  findAll(): Promise<ResponseUserDto[]> {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Retrieve a single user by numeric id.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiOkResponse({ type: ResponseUserDto })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseUserDto> {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id
   * Partially update a user's data.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiOkResponse({ type: ResponseUserDto })
  @ApiBadRequestResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id
   * Remove a user. Returns 204 No Content on success.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a user by id' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
