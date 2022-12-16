import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatues } from 'src/common/constants/enums';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsEnum([OrderStatues.CANCELLED, OrderStatues.DELIVERED, OrderStatues.PICKED])
  status: string;
}
