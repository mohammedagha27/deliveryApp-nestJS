import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Auth } from 'src/common/decorators';

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
  findAll() {
    return this.orderService.findAllOrders();
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
