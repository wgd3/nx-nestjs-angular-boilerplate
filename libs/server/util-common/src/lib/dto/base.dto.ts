import { IBaseEntity } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

export class BaseDto implements IBaseEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  constructor(entity: IBaseEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
