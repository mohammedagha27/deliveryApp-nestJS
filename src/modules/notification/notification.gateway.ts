import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { verifyToken } from 'src/common/utils';
import { ConfigService } from '@nestjs/config';
import { EVENTS, RoleValues, SECRET_KEY } from 'src/common/constants';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderService } from '../order/order.service';
import { AddressService } from '../address/address.service';
import { OrderCreatedEvent } from 'src/common/interfaces';

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly orderService: OrderService,
    private readonly addressService: AddressService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventGateway');

  afterInit() {
    this.logger.log('Initialized socket.io');
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization;
    if (!token) {
      this.logger.error('No token provided');
      client.disconnect(true);
      return;
    }
    const user = verifyToken(token, this.configService.get(SECRET_KEY));
    this.logger.log(`client ${user.id} connected`);
    console.log(user.role);
    if (user.role === RoleValues.ADMIN) {
      client.join(RoleValues.ADMIN);
      this.logger.log(`client ${user.id} joined ${RoleValues.ADMIN}`);
    } else {
      client.join(user.role + user.id);
      this.logger.log(`client ${user.id} joined ${user.role + user.id}`);
    }
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authorization;
    const user = verifyToken(token, this.configService.get(SECRET_KEY));
    client.leave(user.role);
    this.logger.log(`Client ${user.id} disconnected`);
  }

  @OnEvent(EVENTS.NEW_ORDER_CREATED)
  onNewOrderCreated(event: OrderCreatedEvent) {
    this.logger.log(`new order created: ${event}`);
    this.server
      .to([RoleValues.ADMIN, RoleValues.DELIVERER + event.delivererId])
      .emit(EVENTS.NEW_ORDER_CREATED, event);
  }

  @SubscribeMessage(EVENTS.GET_DISTANCE)
  async getDistance(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    dto: {
      latitude: number;
      longitude: number;
      orderId: number;
    },
  ) {
    const token = client.handshake.headers.authorization;
    if (!token) {
      this.logger.error('No token provided');
      client.disconnect(true);
      return;
    }
    const user = verifyToken(token, this.configService.get(SECRET_KEY));
    const { latitude, longitude, orderId } = dto;
    const order = await this.orderService.findOrderById(orderId, user);
    const TargetAddress = await this.addressService.findAddressById(
      order.address.targetAddressId,
    );
    const distance_km = this.orderService.calculateDistance(
      { latitude, longitude },
      TargetAddress,
    );

    if (distance_km < 1) {
      this.server
        .to([RoleValues.ADMIN, RoleValues.USER + order.clientId])
        .emit(EVENTS.GET_DISTANCE, {
          message: 'the delivery is less than 1 km away!',
        });
    }
  }
}
