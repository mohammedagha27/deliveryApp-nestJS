import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from '../db/database.module';
import { OrderProvider } from './order.provider';
import { AddressModule } from '../address/address.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, ...OrderProvider],
  imports: [DatabaseModule, AddressModule, UserModule],
  exports: [OrderService],
})
export class OrderModule {}
