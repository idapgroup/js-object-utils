import { PrimitiveTypes } from './primitive-types';

type Value = PrimitiveTypes | Date | File | Blob;

type ArrayFormValue = Array<Record<string, FormValue> | FormValue>;

export type FormValue =
  | ArrayFormValue
  | Record<string, ArrayFormValue | Value>
  | Value;

export interface CreateFormDataConfig {
  keyPrefix: string;
  index: number | null;
  booleanMapper: (value: boolean) => string;
  allowNullableValues: boolean;
  allowEmptyValues: boolean;
}
