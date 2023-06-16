import { expect, use } from 'chai';
import { describe, it } from 'mocha';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';

import { createURLParams } from '../src';

use(deepEqualInAnyOrder);

describe('createURLParams function', () => {
  it('should be empty object for empty obj', () => {
    const obj = {};
    expect(createURLParams(obj)).to.deep.equal({});
  });
  it('should be empty object with nullable values in object', () => {
    const obj = { name: null, email: undefined };
    expect(createURLParams(obj)).to.deep.equal({});
  });
  it('should be success for simple object', () => {
    const obj = { name: 'test', email: 'test@email.com' };
    expect(createURLParams(obj)).to.deep.equal({
      name: 'test',
      email: 'test@email.com'
    });
  });
  it('should be success with inner objects and array', () => {
    const obj = {
      name: 'test',
      email: 'test@email.com',
      address: { 'street': '123 Street' },
      additionalEmails: ['test1@email.com', 'test2@email.com', null],
      phones: [
        {
          code: '123',
          phone: '2345435'
        },
        {
          code: '545',
          phone: '55555',
          isConnectable: 1,
          hasSocial: true,
          socials: ['viber', 'telegram']
        }
      ],
      products: [],
      hasSubscription: false,
      test: [true],
    };
    expect(createURLParams(obj)).to.deep.equal({
      name: 'test',
      email: 'test@email.com',
      'additionalEmails[0]': 'test1@email.com',
      'additionalEmails[1]': 'test2@email.com',
      'address[street]': '123 Street',
      'phones[0][code]': '123',
      'phones[0][phone]': '2345435',
      'phones[1][code]': '545',
      'phones[1][phone]': '55555',
      'phones[1][isConnectable]': '1',
      'phones[1][hasSocial]': '1',
      'phones[1][socials][0]': 'viber',
      'phones[1][socials][1]': 'telegram',
      'hasSubscription': '0',
      'test[0]': '1'
    });
  });

  it('should be success with to string arg', () => {
    const obj = { name: 'test', email: 'test@email.com', age: 1 };
    expect(createURLParams(obj)).to.deep.equal({
      name: 'test',
      email: 'test@email.com',
      age: '1'
    });
  });

  it('should be success with default parent arg', () => {
    const obj = { name: 'test', email: 'test@email.com', age: 1 };
    expect(createURLParams(obj)).to.deep.equal({
      name: 'test',
      email: 'test@email.com',
      age: '1'
    });
  });

  it('should be success with default parent arg', () => {
    const obj = { name: 'test', email: 'test@email.com' };
    expect(createURLParams(obj, {keyPrefix: 'parent'})).to.deep.equal({
      'parent[name]': 'test',
      'parent[email]': 'test@email.com'
    });
  });

  it('should be success with default index arg', () => {
    const obj = { name: 'test', email: 'test@email.com' };
    expect(createURLParams(obj, {keyPrefix: 'parent', index:3})).to.deep.equal({
      'parent[3][name]': 'test',
      'parent[3][email]': 'test@email.com'
    });
  });
  it('should be empty object with invalid data', () => {
    expect(createURLParams(null)).to.deep.equal({});
    expect(createURLParams(undefined)).to.deep.equal({});
  });
  it('should be empty object with invalid data', () => {
    expect(createURLParams(null)).to.deep.equal({});
    expect(createURLParams(undefined)).to.deep.equal({});
  });
  it('should be empty object with primitive array values', () => {
    const arr = ['123', 12]
    expect(createURLParams(arr)).to.deep.equal({});
  });
  it('should be success with array objects', () => {
    const arr = [
      {
        code: '123',
        phone: '2345435'
      },
      {
        code: '545',
        phone: '55555',
        isConnectable: 1,
        socials: ['viber', 'telegram']
      }
    ];
    expect(createURLParams(arr)).to.deep.equal({
      "code": "545",
      "phone": "55555",
      "isConnectable": "1",
      "socials[0]": "viber",
      "socials[1]": "telegram"
    });
  });
});
