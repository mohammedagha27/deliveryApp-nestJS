import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Auth, TransactionParam } from 'src/common/decorators';
import { PaginationInfoDto } from 'src/common/dto/PaginationInfoDto';
import { PaginationInterceptor } from 'src/common/interceptors/pageination.interceptor';
import { TransactionInterceptor } from 'src/common/interceptors';
import { Transaction } from 'sequelize';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(TransactionInterceptor)
  @Post('signup')
  SignUp(
    @Body() createUserDto: CreateUserDto,
    @TransactionParam() transaction: Transaction,
  ) {
    const createdUser = this.userService.create(createUserDto, transaction);
    return createdUser;
  }
  @UseInterceptors(TransactionInterceptor)
  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @TransactionParam() transaction: Transaction,
  ) {
    const createdUser = this.userService.login(loginDto, transaction);
    return createdUser;
  }

  @Auth('admin')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  findAll(@Query() query: PaginationInfoDto) {
    return this.userService.findAllUsers(query);
  }

  @Auth('admin')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseInterceptors(TransactionInterceptor)
  @Auth('admin')
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.userService.deleteUser(id);
  }
}
