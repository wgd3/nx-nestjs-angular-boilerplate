import { BaseOrmEntity } from '../database';
import { BaseDto } from '../dto/base.dto';
import { Constructor } from '../types';

export function UseDto(
  dtoClass: Constructor<BaseDto, [BaseOrmEntity, any]>
): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
