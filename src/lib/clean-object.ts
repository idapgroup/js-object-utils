import { CleanObjectConfig, Record } from '../types/clean-object';

const defaultConfig: CleanObjectConfig = {
  removeEmptyValues: false,
};

const needSkipValue = (
  value: unknown,
  { removeEmptyValues }: CleanObjectConfig
): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value !== 'string') {
    return false;
  }
  return value === '' && removeEmptyValues;
};

export const cleanObject = (
  obj: Record,
  config?: Partial<CleanObjectConfig>
): Record => {
  const cfg = Object.assign({ ...defaultConfig }, config || {});

  if (obj === null || obj === undefined) {
    return {};
  }

  if (obj instanceof Blob || obj instanceof File || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.reduce((acc, curr) => {
      return [...acc, cleanObject(curr)];
    }, []);
  }

  const keys = Object.keys(obj);
  if (!keys.length) {
    return {};
  }

  return keys.reduce((acc: Record, key) => {
    const item = obj[key];
    if (needSkipValue(item, cfg)) {
      return acc;
    }
    if (Array.isArray(item)) {
      if (!item.length && cfg.removeEmptyValues) {
        return acc;
      }
      const mapped = item.reduce((arr: Record[], curr) => {
        if (typeof curr === 'object' && curr) {
          const cleared = cleanObject(curr, cfg);
          if (!Object.keys(cleared).length && cfg.removeEmptyValues) {
            return arr;
          }
          return [...arr, cleared];
        }
        const skip = needSkipValue(curr, cfg);
        return skip ? arr : [...arr, curr];
      }, []);
      return { ...acc, [`${key}`]: mapped };
    }

    if (typeof item === 'object' && item) {
      const mapped = cleanObject(item as Record, cfg);
      if (!Object.keys(mapped).length && cfg.removeEmptyValues) {
        return acc;
      }
      return { ...acc, [`${key}`]: mapped };
    }

    return { ...acc, [`${key}`]: item };
  }, {});
};
