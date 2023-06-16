export interface CreateURLParamsConfig {
  keyPrefix: string;
  index: number | null;
  booleanMapper: (value: boolean) => string;
}
