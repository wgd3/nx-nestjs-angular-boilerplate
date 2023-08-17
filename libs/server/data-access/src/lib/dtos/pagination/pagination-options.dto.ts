import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE,
} from '@libs/shared/util-constants';
import { IPaginationOptions, SortOrderType } from '@libs/shared/util-types';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class PaginationOptionsDto implements IPaginationOptions {
  @ApiProperty({
    enum: SortOrderType,
    default: SortOrderType.ASC,
    required: false,
  })
  @IsEnum(SortOrderType)
  @IsOptional()
  readonly order?: SortOrderType;

  @ApiProperty({
    type: Number,
    minimum: 1,
    default: PAGINATION_DEFAULT_PAGE,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
    default: PAGINATION_DEFAULT_PER_PAGE,
    maximum: 50,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly perPage?: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
    default: PAGINATION_DEFAULT_LIMIT,
    maximum: 100,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly limit?: number;

  @ApiHideProperty()
  get skip(): number | undefined {
    return this.page && this.perPage
      ? (this.page - 1) * this.perPage
      : undefined;
  }
}
