import { IPaginatedResponse } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginationResponseDto<T> implements IPaginatedResponse<T> {
  @ApiProperty()
  meta: PaginationMetaDto;

  @ApiProperty()
  data: T[];

  constructor(data: T[], meta: PaginationMetaDto) {
    this.meta = meta;
    this.data = data;
  }
}
