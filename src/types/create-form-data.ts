export interface CreateFormDataConfig {
  keyPrefix: string;
  index: number | null;
  booleanMapper: (value: boolean) => string;
  allowNullableValues: boolean;
  allowEmptyValues: boolean;
}
