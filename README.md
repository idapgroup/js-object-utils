# Js object utils [![NPM Module](https://img.shields.io/npm/v/@idapgroup/js-object-utils.svg)](https://www.npmjs.com/package/@idapgroup/js-object-utils)

Javascript functions for transform or mutate object

## Installation

``` sh
npm install @idapgroup/js-object-utils
```
or

```sh
yarn add @idapgroup/js-object-utils
```

## Usage

### createFormData

Serialize object to FormData instance.

[DEMO](https://stackblitz.com/edit/typescript-br9t3k?file=index.ts)

```js
import { createFormData } from '@idapgroup/js-object-utils';

const object = {
  /**
   * key-value mapping
   * values can be primitives or objects
   */
};

const options = {
  /**
   * prefix for form data key
   * defaults empty string
   */
  keyPrefix: '',

  /**
   * prefix index for form data key
   * defaults to null
   */
  index: null,

  /**
   * callback fn for convert true or false
   * defaults true or false to '1' or '0' respectively
   */
  booleanMapper: (val: boolean) => (val ? '1' : '0'),

  /**
   * allow empty string or array
   * defaults to false
   */
  allowEmptyValues: false,
  
  /**
   * allow nullable values, ignore if emptyValues not allow 
   * defaults to false
   */
  allowNullableValues: false,
};

const formData = createFormData(
  object,
  options, // optional
  existingFormData, // optional
);
```

### createURLParams

Serialize object to object with key and primitive value.

[DEMO](https://stackblitz.com/edit/typescript-1tpwga?file=index.ts)

```js
import { createURLParams } from '@idapgroup/js-object-utils';

const object = {
  /**
   * key-value mapping
   * values can be primitives or objects
   */
};

const options = {
  /**
   * prefix for form data key
   * defaults empty string
   */
  keyPrefix: '',

  /**
   * prefix index for form data key
   * defaults to null
   */
  index: null,

  /**
   * prefix index for form data key
   * defaults to null
   */
  toString: null,

  /**
   * callback fn for convert true or false
   * defaults true or false to '1' or '0' respectively
   */
  booleanMapper: (val: boolean) => (val ? '1' : '0'),
};

const params = createURLParams(
  object,
  options, // optional
);
```
