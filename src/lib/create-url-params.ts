import {
  CreateURLParamsConfig
} from '../types/create-url-params';

import { getKeyString } from './utils/get-key-string';

const defaultConfig: CreateURLParamsConfig = {
  keyPrefix: '',
  toString: false,
  index: null,
  booleanMapper: (val: boolean) => (val ? '1' : '0')
};

export const createURLParams = <T extends object>(
  value: T | T[] | null | undefined,
  config?: Partial<CreateURLParamsConfig>
): object => {
  const { keyPrefix, toString, index, booleanMapper }: CreateURLParamsConfig =
    Object.assign({ ...defaultConfig }, config || {});

  if (value === undefined || value === null) {
    return {};
  }

  if (Array.isArray(value)) {
    return value.reduce((acc: object, curr, i) => {
      if (typeof curr === 'object') {
        return {
          ...acc,
          ...createURLParams(curr, {
            ...config,
            keyPrefix,
            index: i
          })
        };
      }
      if (!keyPrefix || curr === null || curr === undefined) {
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
    (acc: object, key: string) => {
      const keyString = getKeyString(keyPrefix, key, index);
      const item = value[key as keyof object];

      if (Array.isArray(item)) {
        return {
          ...acc,
          ...createURLParams(item, {
            ...config,
            keyPrefix: keyString
          })
        };
      }

      if (typeof item === 'boolean') {
        return { ...acc, [`${keyString}`]: booleanMapper(item) };
      }

      if (item && typeof item === 'object') {
        return {
          ...acc,
          ...createURLParams(item, { ...config, keyPrefix: keyString })
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
