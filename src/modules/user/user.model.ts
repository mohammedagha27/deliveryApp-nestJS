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
} from 'sequelize-typescript';
import { RoleValues } from 'src/common/constants';
import { Address } from '../address/address.model';

@Scopes(() => {
  return {
    basicData: {
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    },
  };
})
@Table({
  tableName: 'Users',
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @IsInt
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  firstName: string;

  @Column(DataType.STRING)
  lastName: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  password: string;

  @Column(DataType.STRING)
  phoneNumber: string;

  @Column(
    DataType.ENUM(RoleValues.ADMIN, RoleValues.USER, RoleValues.DELIVERER),
  )
  role: RoleValues;

  @ForeignKey(() => Address)
  @IsInt
  @Column(DataType.INTEGER)
  addressId: number;
}
