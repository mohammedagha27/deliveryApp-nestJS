import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Auth } from 'src/common/decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  SignUp(@Body() createUserDto: CreateUserDto) {
    const createdUser = this.userService.create(createUserDto);
    return createdUser;
  }
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const createdUser = this.userService.login(loginDto);
    return createdUser;
  }

  @Auth('admin')
  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @Auth('admin')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Auth('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
