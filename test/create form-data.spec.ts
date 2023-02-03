import spies from 'chai-spies';
import {expect, use, spy} from 'chai';
import {describe, it} from 'mocha';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import {JSDOM} from 'jsdom';
import global from 'jsdom-global';
import chaiDom from 'chai-dom'
import {createFormData} from '../src';

global()

use(deepEqualInAnyOrder);
use(chaiDom);
use(spies);

describe('createFormData function', () => {
  beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>');
    global.document = dom.window.document;
  })
  it('should be empty form data', () => {
    const existingFormData = new FormData();
    const appendSpy = spy.on(existingFormData, 'append');
    createFormData({}, {allowNullableValues: false}, existingFormData);
    createFormData(null, {allowNullableValues: false}, existingFormData);
    createFormData(undefined,{}, existingFormData);
    expect(appendSpy).to.not.have.been.called();
    spy.restore(existingFormData, 'append');
  });
  it('should be existing form data instance', () => {
    const existingFormData = new FormData();
    createFormData({test: '123'}, {allowNullableValues: false}, existingFormData);
    expect(existingFormData).to.have.been.equal(existingFormData);
  });
  it('should be success with nullable values', () => {
    const fd = createFormData({name: null, email: null}, {allowNullableValues: true, allowEmptyValues: true});
    expect(fd.get('name')).to.have.been.equal('');
    expect(fd.get('email')).to.have.been.equal('');
    const fd2 = createFormData({name: null, email: null});
    expect(fd2.has('name')).to.have.been.equal(false);
    expect(fd2.has('email')).to.have.been.equal(false);
  });
  it('should be success with inner object', () => {
    const form = {
      name: 'test',
      email: 'test@email.com',
      address: { street: '123 Street' },
      additionalEmails: ['test1@email.com', 'test2@email.com', null],
    }
    const fd = createFormData(form, {allowNullableValues: true});
    expect(fd.get(`address[street]`)).to.have.been.equal('123 Street');
    expect(fd.get(`additionalEmails[0]`)).to.have.been.equal('test1@email.com');
    expect(fd.has(`additionalEmails[2]`)).to.have.been.false;
  });
  it('should be success with array', () => {
    const form = {
      isConnectable: true,
      subscription: {
        active: false,
      },
      phones: [
        {
          code: '123',
          phone: '2345435',
        },
        {
          code: '545',
          phone: '55555',
          isConnectable: 1,
          hasSocial: true,
          socials: ['viber', 'telegram'],
        },
      ],
      products: [],
      actions: [1, 3, 4],
    }
    const fd = createFormData(form);
    expect(fd.get(`phones[0][code]`)).to.have.been.equal('123');
    expect(fd.has(`phones[0][hasSocial]`)).to.have.been.false;
    expect(fd.get(`phones[1][isConnectable]`)).to.have.been.equal('1');
    expect(fd.get(`phones[1][hasSocial]`)).to.have.been.equal('1');
    expect(fd.get(`phones[1][socials][0]`)).to.have.been.equal('viber');
    expect(fd.has(`products[]`)).to.have.been.false;
    expect(fd.get(`actions[0]`)).to.have.been.equal('1');
  });
  it('should be success with custom mapper', () => {
    const existingFormData = new FormData();
    const form = {
      isConnectable: true,
      subscription: {
        active: false,
        payments: [
          {
            id: 10,
            success: false,
          },
        ],
      },
    }
    const appendSpy = spy.on(existingFormData, 'append');
    const fd = createFormData(form, { booleanMapper: (val) => val ? '1' : '2'}, existingFormData);
    expect(fd.get(`isConnectable`)).to.have.been.equal('1');
    expect(fd.get(`subscription[active]`)).to.have.been.equal('2');
    expect(fd.get(`subscription[payments][0][success]`)).to.have.been.equal('2');
    expect(appendSpy).to.have.been.called.exactly(4);
  });
  it('should be success with initial key prefix and index', () => {
    const form = {
      name: 'test',
      address: { street: '123 Street' },
      additionalEmails: ['test1@email.com', 'test2@email.com', null],
    }
    const fd = createFormData(form, { keyPrefix: 'parent'});
    expect(fd.get(`parent[name]`)).to.have.been.equal('test');
    expect(fd.get(`parent[address][street]`)).to.have.been.equal('123 Street');
    expect(fd.get(`parent[additionalEmails][1]`)).to.have.been.equal('test2@email.com');

    const fd2 = createFormData(form, { keyPrefix: 'parent', index: 3});
    expect(fd2.get(`parent[3][name]`)).to.have.been.equal('test');
    expect(fd2.get(`parent[3][address][3][street]`)).to.have.been.equal('123 Street');
  });
  it('should be success with date', () => {
    const date = new Date(2023, 1, 1);
    const fd = createFormData({date});
    expect(fd.get(`date`)).to.have.been.includes('2023-01-31');
  });
  it('should be success with File', () => {
    const file = new File([], 'test');
    const blob = new Blob([]);
    const fd = createFormData({file, blob});
    expect(fd.get(`file`)).to.have.been.instanceOf(File);
    expect(fd.get(`blob`)).to.have.been.instanceOf(Blob);
  });
  it('should be success one instance of Form data', () => {
    const initial = new FormData();
    const fd = createFormData(initial);
    expect(fd).to.have.been.equal(initial);
  });
  it('should be success with empty values', () => {
    const fd = createFormData({name: '', products: []}, {allowEmptyValues: true});
    expect(fd.get(`name`)).to.have.been.equal('');
    expect(fd.get(`products[]`)).to.have.been.equal('');
    const fd2 = createFormData({name: '', products: []}, {allowEmptyValues: false});
    expect(fd2.has(`name`)).to.have.been.false;
    expect(fd2.has(`products[]`)).to.have.been.false;
    const fd3 = createFormData({name: '', email: null}, {allowEmptyValues: true, allowNullableValues: true});
    expect(fd3.get(`name`)).to.have.been.equal('');
    expect(fd3.get(`email`)).to.have.been.equal('');
  });
})
