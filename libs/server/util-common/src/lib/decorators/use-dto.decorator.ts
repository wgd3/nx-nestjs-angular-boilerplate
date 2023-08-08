import { BaseOrmEntity } from '../database';
import { BaseDto } from '../dto/base.dto';
import { Constructor } from '../types';

export function UseDto(
  dtoClass: Constructor<BaseDto, [BaseOrmEntity]>
): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
