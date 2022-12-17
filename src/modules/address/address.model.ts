import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';

@Scopes(() => {
  return {
    basicData: {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  };
})
@Table({
  tableName: 'Addresses',
  timestamps: true,
})
export class Address extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  city: string;

  @Column(DataType.STRING)
  street: string;

  @Column(DataType.FLOAT)
  longitude: number;

  @Column(DataType.FLOAT)
  latitude: number;
}
