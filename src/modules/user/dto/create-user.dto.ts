import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { RoleValues } from 'src/common/constants';
import { CreateAddressDto } from 'src/modules/address/dto/create-address.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'password is too short',
  })
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber('PS')
  phoneNumber: string;

  @IsEnum(RoleValues, {
    message: 'Role is not valid',
  })
  role: RoleValues;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
