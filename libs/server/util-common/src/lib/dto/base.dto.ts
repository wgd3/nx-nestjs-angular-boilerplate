import { IBaseEntity } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

import { AbstractOrmEntity } from '../database';

export type AbstractDtoOptions = Partial<{ excludeFields?: string[] }>;

export class AbstractDto implements IBaseEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  deletedAt!: Date | null;

  constructor(entity: AbstractOrmEntity, opts?: AbstractDtoOptions) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    if (opts) {
      // do stuff!
    }
  }
}
