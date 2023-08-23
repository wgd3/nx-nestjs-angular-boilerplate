import { AbstractOrmEntity } from '../database';
import { AbstractDto } from '../dto/base.dto';
import { Constructor } from '../types';

export function UseDto(
  dtoClass: Constructor<AbstractDto, [AbstractOrmEntity, unknown]>,
): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
