import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { OrderModule } from '../order/order.module';
import { AddressModule } from '../address/address.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [NotificationGateway],
  imports: [OrderModule, AddressModule, UserModule],
})
export class NotificationModule {}
