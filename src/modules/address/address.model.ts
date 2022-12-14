import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
} from 'sequelize-typescript';

export class Address extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  city: string;

  @Column(DataType.STRING)
  street: string;

  @Column(DataType.STRING)
  longitude: string;

  @Column(DataType.STRING)
  latitude: string;
}
