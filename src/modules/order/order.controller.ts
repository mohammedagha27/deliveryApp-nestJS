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
import { Auth } from 'src/common/decorators';
import { PaginationInterceptor } from 'src/common/interceptors/pageination.interceptor';
import { query } from 'express';
import { PaginationInfoDto } from 'src/common/dto/PaginationInfoDto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth('admin', 'user')
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  @Auth('admin')
  @UseInterceptors(PaginationInterceptor)
  findAll(@Query() query: PaginationInfoDto) {
    return this.orderService.findAllOrders(query);
  }

  @Auth('admin', 'user')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOrderById(id);
  }

  @Auth('user', 'admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }
  @Auth('user')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(id);
  }
}
