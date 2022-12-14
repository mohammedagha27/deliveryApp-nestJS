import { Injectable } from '@nestjs/common';
// import { CreateAddressDto } from './dto/create-address.dto';
// import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  create(createAddressDto) {
    return 'This action adds a new address';
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
