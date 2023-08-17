import { IPaginationOptions, SortOrderType } from '@libs/shared/util-types';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class PaginationOptionsDto implements IPaginationOptions {
  @ApiProperty({
    enum: SortOrderType,
    default: SortOrderType.ASC,
    required: false,
  })
  readonly order!: SortOrderType;

  @ApiProperty({
    type: Number,
    minimum: 1,
    default: 1,
    required: false,
  })
  readonly page!: number;

  @ApiProperty({
    type: Number,
    minimum: 1,
    default: 10,
    maximum: 50,
    required: false,
  })
  readonly take!: number;

  @ApiHideProperty()
  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
