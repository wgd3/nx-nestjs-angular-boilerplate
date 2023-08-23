/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Column, ColumnOptions, ColumnType } from 'typeorm';
import { ColumnEmbeddedOptions } from 'typeorm/decorator/options/ColumnEmbeddedOptions';
import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

// Custom decorator to automatically set column type to 'timestamp' and the transformer to our UTCDateTransformer
// https://github.com/typeorm/typeorm/issues/4519#issuecomment-569883451
export function UTCDateColumn(
  typeOrOptions?:
    | ((type?: any) => Function)
    | ColumnType
    | (ColumnOptions & ColumnEmbeddedOptions),
  options?: ColumnOptions & ColumnEmbeddedOptions,
): Function {
  return function (object: Object, propertyName: string) {
    // normalize parameters
    let type: ColumnType | undefined;
    if (
      typeof typeOrOptions === 'string' ||
      typeOrOptions instanceof Function
    ) {
      type = <ColumnType>typeOrOptions || 'timestamp';
    } else if (typeOrOptions) {
      options = <ColumnOptions>typeOrOptions;
      type = typeOrOptions.type || 'timestamp';
    }
    if (!options) options = {} as ColumnOptions;
    options.transformer = UTCDateTransformer;

    return Column(<any>type, options)(object, propertyName);
  };
}

// Transformer used to make sure that everything stays happy.
export const UTCDateTransformer: ValueTransformer = {
  to(value: any): any {
    // I remove the Z because this is what causes DateUtils.mixedDateToDate to recognize that it's UTC and convert it to local time
    // by doing this, it assumes that the date MUST be in our local time, this can have some side effects if mistakenly used.
    return value
      ? (typeof value !== 'string'
          ? (<Date>value).toISOString()
          : value
        ).replace('Z', '')
      : value;
  },
  from(value: any): any {
    // This is just a sanity thing, it should be coming back from the database as a date object, but just to be safe,
    // this could probably be better, but i haven't run into issues with it yet.
    return typeof value === 'string'
      ? new Date(value.indexOf('Z') !== -1 ? value : value + 'Z')
      : value;
  },
};
