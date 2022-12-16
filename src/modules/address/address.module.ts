import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { AddressProvider } from './address.provider';
import { AddressService } from './address.service';

@Module({
  providers: [AddressService, ...AddressProvider],
  imports: [DatabaseModule],
  exports: [AddressService],
})
export class AddressModule {}
