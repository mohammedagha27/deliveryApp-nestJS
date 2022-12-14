import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth, TransactionParam, User } from 'src/common/decorators';
import { PaginationInterceptor } from 'src/common/interceptors/pageination.interceptor';
import { PaginationInfoDto } from 'src/common/dto/PaginationInfoDto';
import { RequestUser } from 'src/common/interfaces';
import { RoleValues } from 'src/common/constants';
import { TransactionInterceptor } from 'src/common/interceptors';
import { Transaction } from 'sequelize';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseInterceptors(TransactionInterceptor)
  @Auth(RoleValues.ADMIN, RoleValues.USER)
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @User('id') userId: number,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.orderService.createOrder(createOrderDto, userId, transaction);
  }

  @Get()
  @Auth(RoleValues.ADMIN, RoleValues.USER, RoleValues.DELIVERER)
  @UseInterceptors(PaginationInterceptor)
  findAll(@Query() query: PaginationInfoDto, @User() user: RequestUser) {
    return this.orderService.findAllOrders(query, user);
  }

  @Auth(RoleValues.ADMIN, RoleValues.USER, RoleValues.DELIVERER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @User() user: RequestUser) {
    return this.orderService.findOrderById(id, user);
  }

  @Auth(RoleValues.ADMIN, RoleValues.USER, RoleValues.DELIVERER)
  @UseInterceptors(TransactionInterceptor)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @User() user: RequestUser,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.orderService.updateOrder(id, updateOrderDto, user, transaction);
  }
  @Auth(RoleValues.ADMIN, RoleValues.USER)
  @UseInterceptors(TransactionInterceptor)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: RequestUser,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.orderService.deleteOrder(id, user, transaction);
  }
}
