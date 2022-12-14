import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;
}
