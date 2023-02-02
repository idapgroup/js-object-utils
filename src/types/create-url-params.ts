import { PrimitiveTypes } from './primitive-types';

export type ArrayRecordType = Array<
  Record<string, RecordValue> | string | number | boolean
>;

export type RecordValue =
  | PrimitiveTypes
  | Record<string, PrimitiveTypes>
  | ArrayRecordType;

export interface CreateURLParamsConfig {
  keyPrefix: string;
  toString: boolean;
  index: number | null;
  booleanMapper: (value: boolean) => string;
}
