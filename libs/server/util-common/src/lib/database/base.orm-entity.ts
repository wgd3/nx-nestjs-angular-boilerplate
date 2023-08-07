import {
  BaseEntity as BaseTypeormEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { BaseDto } from '../dto/base.dto';
import { IBaseEntity, Uuid } from '@libs/shared/util-interfaces';
import { Constructor } from '../types';

/**
 * Class intended to be extended by any ORM entity in the application.
 * 
 * Credit to https://github.com/NarHakobyan/awesome-nest-boilerplate/blob/e70667eac4421fb462ca2d0ad4ddb670242293f7/src/common/abstract.entity.ts
 */
export class BaseOrmEntity<DTO extends BaseDto = BaseDto, Options = never>
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

  private dtoClass?: Constructor<DTO, [BaseOrmEntity, Options?]>;

  toJSON() {
    return instanceToPlain(this);
  }

  toDto(options?: Options): DTO {
    if (!this.dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`
      );
    }
    return new this.dtoClass(this, options);
  }
}
