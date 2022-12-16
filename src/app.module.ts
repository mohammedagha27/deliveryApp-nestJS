import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/db/database.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { AddressModule } from './modules/address/address.module';
import { NotificationModule } from './modules/notification/notification.module';
import configurationFile from 'config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurationFile],
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    OrderModule,
    AddressModule,
    NotificationModule,
  ],
})
export class AppModule {}
