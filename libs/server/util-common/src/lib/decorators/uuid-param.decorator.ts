import { Type, PipeTransform, Param, ParseUUIDPipe } from "@nestjs/common";

export function UUIDParam(
    property: string,
    ...pipes: Array<Type<PipeTransform> | PipeTransform>
  ): ParameterDecorator {
    return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
  }