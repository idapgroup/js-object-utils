import { CreateURLParamsConfig } from '../types/create-url-params';

import { getKeyString } from './utils/get-key-string';

const defaultConfig: CreateURLParamsConfig = {
  keyPrefix: '',
  index: null,
  booleanMapper: (val: boolean) => (val ? '1' : '0'),
};

export const createURLParams = <T extends Record<string, any>>(
  value: T | T[] | null | undefined,
  config?: Partial<CreateURLParamsConfig>
): Record<string, string> => {
  const { keyPrefix, index, booleanMapper }: CreateURLParamsConfig =
    Object.assign({ ...defaultConfig }, config || {});

  if (value === undefined || value === null) {
    return {};
  }

  if (Array.isArray(value)) {
    return value.reduce((acc: Record<string, any>, curr, i) => {
      if (typeof curr === 'object' && curr) {
        return {
          ...acc,
          ...createURLParams(curr, {
            ...config,
            keyPrefix,
            index: i,
          }),
        };
      }
      if (!keyPrefix || curr === null || curr === undefined) {
        return acc;
      }
      const value =
        typeof curr === 'boolean' ? booleanMapper(curr) : String(curr);
      return { ...acc, [`${keyPrefix}[${i}]`]: value };
    }, {});
  }

  return Object.keys(value).reduce(
    (acc: Record<string, string>, key: string) => {
      const keyString = getKeyString(keyPrefix, key, index);
      const item = value[key as keyof Record<string, string>];

      if (Array.isArray(item)) {
        return {
          ...acc,
          ...createURLParams(item, {
            ...config,
            keyPrefix: keyString,
          }),
        };
      }

      if (item === null || item === undefined) {
        return acc;
      }

      if (typeof item === 'boolean') {
        return { ...acc, [`${keyString}`]: booleanMapper(item) };
      }

      if (typeof item === 'object') {
        return {
          ...acc,
          ...createURLParams(item, { ...config, keyPrefix: keyString }),
        };
      }
      return { ...acc, [`${keyString}`]: String(item) };
    },
    {}
  );
};
