import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { KM_FEE, REPOS } from 'src/common/constants';
import { AddressService } from '../address/address.service';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.model';
import { getDistance } from 'geolib';
import { PaginationInfoDto } from 'src/common/dto/PaginationInfoDto';
@Injectable()
export class OrderService {
  constructor(
    @Inject(REPOS.ORDER_REPOSITORY)
    private readonly orderRepository: typeof Order,
    private readonly addressService: AddressService,
  ) {}
  async createOrder(createOrderDto: CreateOrderDto) {
    const { price, sourceAddress, targetAddress } = createOrderDto;
    const sourceAddressId = await this.addressService.checkAddressExist(
      sourceAddress,
    );
    const targetAddressId = await this.addressService.checkAddressExist(
      targetAddress,
    );
    const address = { sourceAddressId, targetAddressId };
    const distance = this.calculateDistance(sourceAddress, targetAddress);
    const fee = this.calculateOrderFee(distance);
    const totalPrice = +price + fee;
    const order = await this.orderRepository.create({
      ...createOrderDto,
      clientId: 1,
      totalPrice,
      fee,
      address,
    });
    return order;
  }

  calculateOrderFee(distance: number) {
    const fee = distance * KM_FEE;
    return fee;
  }
  calculateDistance(
    sourceAddress: CreateAddressDto,
    targetAddress: CreateAddressDto,
  ) {
    const source = {
      lat: sourceAddress.latitude,
      lng: sourceAddress.longitude,
    };
    const address = {
      lat: targetAddress.latitude,
      lng: targetAddress.longitude,
    };
    const distance_m = getDistance(source, address);
    const distance_km = distance_m / 1000;
    return distance_km;
  }
  async findAllOrders(query: PaginationInfoDto): Promise<Order[]> {
    const { limit, offset } = query;
    const orders = await this.orderRepository.findAll({ limit, offset });
    return orders;
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findByPk(id);
    if (!order) throw new NotFoundException('order not found');
    return order;
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOrderById(id);
    await order.update({ ...updateOrderDto });
    return order;
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.findOrderById(id);
    order.destroy();
    return;
  }
}
