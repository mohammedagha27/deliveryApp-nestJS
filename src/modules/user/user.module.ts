import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProvider } from './user.provider';
import { DatabaseModule } from '../db/database.module';
import { AddressModule } from '../address/address.module';

@Module({
  controllers: [UserController],
  imports: [DatabaseModule, AddressModule],
  providers: [UserService, ...UserProvider],
  exports: [UserService],
})
export class UserModule {}
