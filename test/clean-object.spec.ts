import { expect, use } from 'chai';
import { describe, it } from 'mocha';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';

import { cleanObject } from '../src';

use(deepEqualInAnyOrder);

describe('cleanObject function', () => {
  it('should be success for simple values', () => {
    expect(cleanObject({})).to.deep.equal({});
    expect(cleanObject(null)).to.deep.equal({});
    const date = new Date();
    expect(cleanObject(date)).to.deep.equal(date);
    expect(cleanObject([])).to.deep.equal([]);
  });

  it('should be success for nullable values obj', () => {
    const file = new File([], 'test');
    const obj = {
      id: 1,
      name: 'test',
      surName: '',
      email: undefined,
      address: null,
      subscription: {
        active: false,
        status: null,
        file,
        previous: [],
        obj: {},
      },
      file,
      simpleArray: ['', 'test', null],
      arr: [{ id: 1, name: '', active: null }, null, { id: 3 }, {}, [], file]
    };
    const expectedResult = {
      id: 1,
      name: 'test',
      surName: '',
      subscription: {
        active: false,
        file,
        previous: [],
        obj: {},
      },
      file,
      simpleArray: ['', 'test'],
      arr: [{ id: 1, name: '' }, { id: 3 }, {}, [], file]
    };
    expect(cleanObject(obj)).to.deep.equal(expectedResult);
  });
  it('should be success for empty string and array in obj', () => {
    const obj = {
      id: 1,
      name: 'test',
      surName: '',
      address: null,
      subscription: {
        active: false,
        status: '',
        previous: [{ id: 1, status: null }],
        emptyArr: [],
        obj: {},
      },
      simpleArray: ['', 'test', null],
      arr: [{ id: 1, name: '' }, null, {}, []]
    };
    const expectedResult = {
      id: 1,
      name: 'test',
      subscription: {
        active: false,
        previous: [{ id: 1 }]
      },
      simpleArray: ['test'],
      arr: [{ id: 1 }]
    };
    expect(cleanObject(obj, { removeEmptyValues: true })).to.deep.equal(expectedResult);
  });
});
