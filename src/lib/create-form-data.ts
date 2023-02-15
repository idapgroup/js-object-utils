import { CreateFormDataConfig } from '../types/create-form-data';
import { PrimitiveTypes } from '../types/primitive-types';

import { getKeyString } from './utils/get-key-string';

/**
 *  fill form data recursive function
 * @param value - form value
 * @param config - configuration object
 * @param formData - form data instance
 */
const fillFormData = <T extends object>(
  value: T | T[] | PrimitiveTypes,
  config: CreateFormDataConfig,
  formData: FormData
): void => {
  const {
    keyPrefix,
    index,
    booleanMapper,
    allowNullableValues,
    allowEmptyValues,
  } = config;

  if (value === undefined || value === null) {
    if (allowNullableValues && allowEmptyValues) {
      formData.append(keyPrefix, '');
    }
  } else if (typeof value === 'boolean') {
    formData.append(keyPrefix, booleanMapper(value));
  } else if (value instanceof Date) {
    formData.append(keyPrefix, value.toISOString());
  } else if (Array.isArray(value)) {
    if (value.length === 0 && allowEmptyValues) {
      formData.append(`${keyPrefix}[]`, '');
    } else {
      value.forEach((item, index) => {
        fillFormData(
          item,
          { ...config, keyPrefix: `${keyPrefix}[${index}]` },
          formData
        );
      });
    }
  } else if (typeof value === 'object') {
    if (value instanceof File) {
      formData.append(keyPrefix, value, value.name);
    } else if (value instanceof Blob) {
      formData.append(keyPrefix, value);
    } else {
      Object.keys(value).forEach((key) => {
        const keyString = getKeyString(keyPrefix, key, index);
        fillFormData(
          value[key as keyof object],
          { ...config, keyPrefix: keyString },
          formData
        );
      });
    }
  } else {
    const primitiveValue = value.toString();
    if (primitiveValue === '' && !allowEmptyValues) {
      return;
    }
    formData.append(keyPrefix, primitiveValue);
  }
};

const defaultConfig = {
  keyPrefix: '',
  index: null,
  booleanMapper: (val: boolean) => (val ? '1' : '0'),
  allowNullableValues: false,
  allowEmptyValues: false,
};
/**
 *  fill form data recursive function
 * @param value - form value
 * @param options - configuration object
 * @param existingFormData - optional existing form data instance
 */
export const createFormData = <T extends object>(
  value: T | FormData,
  options?: Partial<CreateFormDataConfig>,
  existingFormData?: FormData
): FormData => {
  // create config from default and argument options
  const config = Object.assign({ ...defaultConfig }, options || {});

  // return form data if value instanceof FormData
  if (value instanceof FormData) {
    return value;
  }

  // return empty form data if value null or undefined
  if (value === undefined || value === null) {
    return existingFormData || new FormData();
  }
  // fill form data by form value and return
  const formData = existingFormData || new FormData();
  fillFormData({ ...value }, config, formData);
  return formData;
};
