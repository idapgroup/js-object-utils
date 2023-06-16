export interface CleanObjectConfig {
  removeEmptyValues: boolean;
}

export type NonNullableFields<T extends Record<string, any>> = {
  [Key in keyof T]: T[Key] extends infer U
    ? U extends null
      ? never
      : U
    : never;
};
