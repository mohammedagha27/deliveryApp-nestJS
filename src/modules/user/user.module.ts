import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProvider } from './user.provider';
import { DatabaseModule } from '../db/database.module';

@Module({
  controllers: [UserController],
  imports: [DatabaseModule],
  providers: [UserService, ...UserProvider],
})
export class UserModule {}
