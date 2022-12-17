import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { OrderModule } from '../order/order.module';
import { AddressModule } from '../address/address.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [NotificationGateway, NotificationService],
  imports: [OrderModule, AddressModule, UserModule],
})
export class NotificationModule {}
