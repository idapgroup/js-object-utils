import { CleanObjectConfig, NonNullableFields } from '../types/clean-object';

import { isObject } from './is-object';

const defaultConfig: CleanObjectConfig = {
  removeEmptyValues: false,
};

const isEmptyObject = (o: Record<string, any>) => Object.keys(o).length === 0;

const needSkipValue = (
  value: unknown,
  { removeEmptyValues }: CleanObjectConfig
): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  if (removeEmptyValues) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    if (typeof value === 'string') {
      return !value;
    }
    if (isObject(value) && isEmptyObject(value)) {
      return true;
    }
  }
  return false;
};

export const cleanObject = <T extends Record<string, any>>(
  obj: T,
  config?: Partial<CleanObjectConfig>
): NonNullableFields<T> => {
  const cfg = Object.assign({ ...defaultConfig }, config || {});

  if (!isObject(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.reduce((acc, curr) => {
      return [...acc, cleanObject(curr)];
    }, []);
  }

  const keys = Object.keys(obj);
  if (!keys.length) {
    return obj;
  }

  return keys.reduce((acc: Record<string, any>, key) => {
    const item = obj[key as keyof T];
    if (needSkipValue(item, cfg)) {
      return acc;
    }
    if (Array.isArray(item)) {
      if (!item.length && cfg.removeEmptyValues) {
        return acc;
      }
      const mapped = item.reduce((arr: Record<string, any>[], curr: any) => {
        if (isObject(curr)) {
          const cleared = cleanObject(curr, cfg);
          if (isEmptyObject(cleared) && cfg.removeEmptyValues) {
            return arr;
          }
          return [...arr, cleared];
        }
        const skip = needSkipValue(curr, cfg);
        return skip ? arr : [...arr, curr];
      }, []);
      return { ...acc, [`${key}`]: mapped };
    }

    if (item && typeof item === 'object' && isObject(item)) {
      const mapped = cleanObject(item, cfg);
      if (isEmptyObject(mapped) && cfg.removeEmptyValues) {
        return acc;
      }
      return { ...acc, [`${key}`]: mapped };
    }

    return { ...acc, [`${key}`]: item };
  }, {}) as NonNullableFields<T>;
};
