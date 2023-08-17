import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE,
} from '@libs/shared/util-constants';
import { IPaginationMeta } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto implements IPaginationMeta {
  @ApiProperty({
    default: PAGINATION_DEFAULT_PAGE,
  })
  @IsInt()
  @Min(1)
  readonly page!: number;

  @ApiProperty({
    default: PAGINATION_DEFAULT_PER_PAGE,
  })
  @IsInt()
  @Min(1)
  @Max(50)
  readonly perPage!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  readonly totalItems!: number;

  @ApiProperty({
    default: 1,
  })
  @IsInt()
  @Min(1)
  readonly totalPages!: number;

  @ApiProperty()
  @IsBoolean()
  readonly hasNextPage!: boolean;

  @ApiProperty()
  @IsBoolean()
  readonly hasPreviousPage!: boolean;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  readonly nextPage!: string | null;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  readonly previousPage!: string | null;

  constructor(meta: Partial<IPaginationMeta>) {
    Object.assign(this, meta);
  }
}
