import { Param, ParseUUIDPipe, PipeTransform, Type } from '@nestjs/common';

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe(), ...pipes);
}
