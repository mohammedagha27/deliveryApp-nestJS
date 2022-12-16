import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsEnum,
  IsObject,
  ValidateNested,
  IsNumber,
  isEmpty,
  IsOptional,
} from 'class-validator';
import { CreateAddressDto } from 'src/modules/address/dto/create-address.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  price: number;

  @IsOptional()
  tax: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => Number(value))
  @IsNumber()
  delivererId: number;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  sourceAddress: CreateAddressDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  targetAddress: CreateAddressDto;
}
