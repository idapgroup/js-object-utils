import {describe, it} from "mocha";
import {expect, use} from "chai";
import {keysToSnakeCase} from "../src";
import deepEqualInAnyOrder from 'deep-equal-in-any-order';

use(deepEqualInAnyOrder);
describe('keysToSnakeCase function', () => {
  it('should be object with snake keys', () => {
    const obj = {
      name: 'test',
      address: { 'street': '123 Street' },
      additionalEmails: ['test1@email.com', 'test2@email.com', null],
      phones: [
        {
          countryCode: '123',
          phoneNumber: '2345435'
        },
        {
          countryCode: '545',
          phoneNumber: '55555',
          isConnectable: 1,
          hasSocial: true,
          socials: ['viber', 'telegram']
        }
      ],
      products: [],
      hasSubscription: false,
      test: [true],
    };
    expect(keysToSnakeCase(obj)).to.deep.equal({
      name: 'test',
      address: { 'street': '123 Street' },
      additional_emails: ['test1@email.com', 'test2@email.com', null],
      phones: [
        {
          country_code: '123',
          phone_number: '2345435'
        },
        {
          country_code: '545',
          phone_number: '55555',
          is_connectable: 1,
          has_social: true,
          socials: ['viber', 'telegram']
        }
      ],
      products: [],
      has_subscription: false,
      test: [true],
    })
  });
  it('should be object array with snake keys', () => {
    const arr = [
      {
        countryCode: '123',
        phoneNumber: '2345435'
      },
      {
        code: '545',
        phoneNumber: '55555',
        isConnectable: 1,
        socials: ['viber', 'telegram']
      }
    ];
    expect(keysToSnakeCase(arr)).to.deep.equal([
      {
        country_code: '123',
        phone_number: '2345435'
      },
      {
        code: '545',
        phone_number: '55555',
        is_connectable: 1,
        socials: ['viber', 'telegram']
      }
    ])
  })
})
