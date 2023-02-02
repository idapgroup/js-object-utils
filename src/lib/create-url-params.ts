import {
  ArrayRecordType,
  CreateURLParamsConfig,
  RecordValue,
} from './types/create-url-params';
import { getKeyString } from './utils/get-key-string';

export const createURLParams = (
  value: Readonly<Record<string, RecordValue>> | ArrayRecordType,
  config?: Partial<CreateURLParamsConfig>
): Record<string, RecordValue> => {
  const { keyPrefix, toString, index, booleanMapper }: CreateURLParamsConfig =
    Object.assign(
      {
        keyPrefix: '',
        toString: false,
        index: null,
        booleanMapper: (val: boolean) => (val ? '1' : '0'),
      },
      config || {}
    );

  if (value === undefined || value === null) {
    return {};
  }

  if (Array.isArray(value)) {
    return value.reduce((acc: Record<string, RecordValue>, curr, i) => {
      if (typeof curr === 'object') {
        return {
          ...acc,
          ...createURLParams(curr, {
            ...config,
            keyPrefix,
            index: i,
          }),
        };
      }
      if (!keyPrefix) {
        return acc;
      }
      const value =
        typeof curr === 'boolean'
          ? booleanMapper(curr)
          : toString
          ? String(curr)
          : curr;
      return { ...acc, [`${keyPrefix}[${i}]`]: value };
    }, {});
  }

  return Object.keys(value).reduce(
    (acc: Record<string, RecordValue>, key: string) => {
      const keyString = getKeyString(keyPrefix, key, index);
      const item = value[key];

      if (Array.isArray(item)) {
        return {
          ...acc,
          ...createURLParams(item, {
            ...config,
            keyPrefix: keyString,
          }),
        };
      }

      if (typeof item === 'boolean') {
        return { ...acc, [`${keyString}`]: booleanMapper(item) };
      }

      if (item && typeof item === 'object') {
        return {
          ...acc,
          ...createURLParams(item, { ...config, keyPrefix: keyString }),
        };
      }

      if (item !== null && item !== undefined) {
        const val = toString ? String(item) : item;
        return { ...acc, [`${keyString}`]: val };
      }
      return acc;
    },
    {}
  );
};
