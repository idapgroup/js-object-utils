import { expect } from 'chai';
import { describe, it } from 'mocha';

import { isObject } from '../src';

class TestClass { x = 1}

describe('isObject function', () => {
  it('should be true with objects created by the `Object` constructor.', () => {
    expect(isObject({})).to.be.true;
    expect(isObject(Object.create({}))).to.be.true;
    expect(isObject(Object.create(Object.prototype))).to.be.true;
    expect(isObject({test: 'test'})).to.be.true;
    expect(isObject(Object.create(null))).to.be.true;
    const testInstance = new TestClass();
    expect(isObject(testInstance)).to.be.true;
  })
  it('should be false if the value is not created by the `Object` constructor.', () => {
    expect(isObject(new Date())).to.be.false;
    expect(isObject(null)).to.be.false;
    expect(isObject([])).to.be.false;
    expect(isObject([{}, {}])).to.be.false;
    expect(isObject(1)).to.be.false;
    expect(isObject(new String(''))).to.be.false;
    expect(isObject(function (){})).to.be.false;
  })
})
