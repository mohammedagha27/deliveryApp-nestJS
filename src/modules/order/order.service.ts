import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { KM_FEE, REPOS, RoleValues } from 'src/common/constants';
import { AddressService } from '../address/address.service';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.model';
import { getDistance } from 'geolib';
import { PaginationInfoDto } from 'src/common/dto/PaginationInfoDto';
import { OrderCreatedEvent, RequestUser } from 'src/common/interfaces';
import { Transaction, WhereOptions } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class OrderService {
  constructor(
    @Inject(REPOS.ORDER_REPOSITORY)
    private readonly orderRepository: typeof Order,
    private readonly addressService: AddressService,
    private eventEmitter: EventEmitter2,
  ) {}
  async createOrder(
    createOrderDto: CreateOrderDto,
    clientId: number,
    transaction?: Transaction,
  ) {
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
    const order = await this.orderRepository.create(
      {
        ...createOrderDto,
        clientId,
        totalPrice,
        fee,
        address,
      },
      { transaction },
    );
    const orderCreatedEvent: OrderCreatedEvent = {
      targetAddress,
      sourceAddress,
      clientId,
      delivererId: order.delivererId,
    };
    this.eventEmitter.emit('newOrderCreated', orderCreatedEvent);
    return order;
  }

  calculateOrderFee(distance: number) {
    const fee = distance * KM_FEE;
    return fee;
  }

  calculateDistance(
    sourceAddress: CreateAddressDto | { latitude: number; longitude: number },
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
  async findAllOrders(
    query: PaginationInfoDto,
    user: RequestUser,
  ): Promise<Order[]> {
    const { limit, offset } = query;
    const { role, id } = user;
    let where: WhereOptions<any>;
    if (role === RoleValues.USER) {
      where = {
        clientId: id,
      };
    }
    if (role === RoleValues.DELIVERER) {
      where = {
        delivererId: id,
      };
    }
    const orders = await this.orderRepository.findAll({ where, limit, offset });
    return orders;
  }

  checkOrderOwners(order: Order, user: RequestUser) {
    const { id, role } = user;
    if (role === RoleValues.ADMIN) return order;
    const { clientId, delivererId } = order;
    if (clientId === id || delivererId === id) return order;
    else throw new ForbiddenException();
  }
  async findOrderById(id: number, user: RequestUser): Promise<Order> {
    const order = await this.orderRepository.findByPk(id);
    if (!order) throw new NotFoundException('order not found');
    return this.checkOrderOwners(order, user);
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
    user: RequestUser,
    transaction?: Transaction,
  ) {
    const order = await this.findOrderById(id, user);
    await order.update({ ...updateOrderDto }, { transaction });
    return order;
  }

  async deleteOrder(
    id: number,
    user: RequestUser,
    transaction?: Transaction,
  ): Promise<void> {
    const order = await this.findOrderById(id, user);
    order.destroy({ transaction });
    return;
  }
}
