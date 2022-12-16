import {
  Model,
  Table,
  Column,
  Scopes,
  DataType,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  IsInt,
  Default,
  NotEmpty,
  AllowNull,
} from 'sequelize-typescript';
import { RoleValues } from 'src/common/constants';
import { OrderStatues } from 'src/common/constants/enums';
import { Address } from '../address/address.model';
import { User } from '../user/user.model';

@Table({
  tableName: 'Orders',
  timestamps: true,
  paranoid: true,
})
export class Order extends Model {
  @PrimaryKey
  @AutoIncrement
  @IsInt
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  price: string;

  @AllowNull(false)
  @Default('.2')
  @Column(DataType.STRING)
  fee: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  totalPrice: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @IsInt
  @Column(DataType.INTEGER)
  clientId: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @IsInt
  @Column(DataType.INTEGER)
  delivererId: number;

  @AllowNull(false)
  @Column(DataType.JSON)
  address: {
    sourceAddressId: number;
    targetAddressId: number;
  };
  @Default(OrderStatues.WAITING)
  @Column(
    DataType.ENUM(
      OrderStatues.WAITING,
      OrderStatues.CANCELLED,
      OrderStatues.PICKED,
      OrderStatues.DELIVERED,
    ),
  )
  status: OrderStatues;
}
