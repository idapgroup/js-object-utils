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

### isObject

Detect is object created by the `Object` constructor

```js
import { isObject } from '@idapgroup/js-object-utils';

const object = {
  /**
   * key: value
   * values can be primitives or objects
   */
};

const isObj = isObject(object) // true of false;
```

### createFormData

Serialize object to FormData instance.

[DEMO](https://stackblitz.com/edit/typescript-br9t3k?file=index.ts)

<details>
  <summary>Options</summary>

  ```js
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
  ```
</details>

```js
import { createFormData } from '@idapgroup/js-object-utils';

const object = {
  /**
   * key: value
   * values can be primitives or objects
   */
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

<details>
  <summary>Options</summary>

  ```js
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
  };
  ```

</details>

```js
import { createURLParams } from '@idapgroup/js-object-utils';

const object = {
  /**
   * key: value
   * values can be primitives or objects
   */
};

const params = createURLParams(
  object,
  options, // optional
);
```


### cleanObject

Remove nullable/empty values in object

[DEMO](https://stackblitz.com/edit/typescript-hidjfj?file=index.html)

<details>
  <summary>Options</summary>

  ```js
  const options = {
    /**
     * remove empty string, object, array in object
     * defaults false
     */
    removeEmptyValues: false,
  };
  ```
</details>

```js
import { cleanObject } from '@idapgroup/js-object-utils';

const object = {
  /**
   * key: value
   * values can be primitives or objects
   */
};

const obj = cleanObject(
  object, 
  options, // optional
);
```

### keysToSnakeCase

Transform object keys to snake case

```js
import { cleanObject } from '@idapgroup/keysToSnakeCase';

const object = {
  /**
   * key: value
   * values can be primitives or objects
   */
};

const obj = keysToSnakeCase(
  object
);
```
