import { IPaginationMeta } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto implements IPaginationMeta {
  @ApiProperty()
  readonly page!: number;

  @ApiProperty()
  readonly take!: number;

  @ApiProperty()
  readonly totalItems!: number;

  @ApiProperty()
  readonly totalPages!: number;

  @ApiProperty()
  readonly hasNextPage!: boolean;

  @ApiProperty()
  readonly hasPreviousPage!: boolean;

  @ApiProperty()
  readonly nextPage!: string | null;

  @ApiProperty()
  readonly previousPage!: string | null;
}
