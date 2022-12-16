import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/common/constants';
import { toNumber } from 'src/common/utils/cast';

export class PaginationInfoDto {
  @Transform(({ value }) => toNumber(value, DEFAULT_OFFSET))
  @IsNumber()
  @IsOptional()
  offset?: number;
  @Transform(({ value }) => toNumber(value, DEFAULT_LIMIT))
  @IsNumber()
  @IsOptional()
  limit?: number;
}
