import { Inject, Injectable } from '@nestjs/common';
import { REPOS } from 'src/common/constants';
import { Address } from './address.model';
import { CreateAddressDto } from './dto/create-address.dto';
// import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @Inject(REPOS.ADDRESSES_REPOSITORY)
    private readonly addressRepository: typeof Address,
  ) {}
  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = await this.addressRepository.create({
      ...createAddressDto,
    });
    return address;
  }

  async findAddress(longitude: number, latitude: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: {
        longitude,
        latitude,
      },
    });
    return address;
  }
  async findAddressById(id: number): Promise<Address> {
    const address = await this.addressRepository.findByPk(id);
    return address;
  }
  async checkAddressExist(address: CreateAddressDto) {
    const { longitude, latitude } = address;
    const dbAddress = await this.findAddress(longitude, latitude);
    if (dbAddress) return dbAddress.id;
    const newAddress = await this.create(address);
    return newAddress.id;
  }
}
