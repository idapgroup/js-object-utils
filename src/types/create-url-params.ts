export interface CreateURLParamsConfig {
  keyPrefix: string;
  toString: boolean;
  index: number | null;
  booleanMapper: (value: boolean) => string;
}
