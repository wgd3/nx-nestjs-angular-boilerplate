import { Exclude, instanceToPlain } from 'class-transformer';
import {
  BaseEntity as BaseTypeormEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IBaseEntity, Uuid } from '@libs/shared/util-types';

import { AbstractDto } from '../dto/base.dto';
import { Constructor } from '../types';

/**
 * Class intended to be extended by any ORM entity in the application.
 *
 * Credit to https://github.com/NarHakobyan/awesome-nest-boilerplate/blob/e70667eac4421fb462ca2d0ad4ddb670242293f7/src/common/abstract.entity.ts
 */
export abstract class AbstractOrmEntity<
    DTO extends AbstractDto = AbstractDto,
    Options = never,
  >
  extends BaseTypeormEntity
  implements IBaseEntity
{
  @PrimaryGeneratedColumn('uuid')
  id!: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  @Exclude({ toPlainOnly: true })
  deletedAt!: Date | null;

  protected dtoClass?: Constructor<DTO, [AbstractOrmEntity, Options?]>;

  toJSON() {
    return instanceToPlain(this);
  }

  toDto(options?: Options): DTO {
    if (!this.dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }
    return new this.dtoClass(this, options);
  }

  constructor(entity: AbstractOrmEntity, opts?: unknown) {
    super();
    if (entity && opts) {
      // just here to avoid unused vars linting errors
    }
  }
}
