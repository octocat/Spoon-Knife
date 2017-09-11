import TetherBase from '../../src/js/utils';
const {extend, addClass, hasClass, removeClass} = TetherBase.Utils;

import {expect} from 'chai';

describe('TetherBase', () => {
  it('has the array of the modules', () => {
    expect(TetherBase.modules).to.be.an('array')
  })
})

describe('extend', () => {
  it('returns the merged result of the given objects', () => {
    expect(extend({a: 0}, {b: 1})).to.deep.equal({a: 0, b: 1});
    expect(extend({a: 0}, {b: 1}, {c: 2})).to.deep.equal({a: 0, b: 1, c: 2});
  });

  it('extends the given objects', () => {
    const obj = {foo: 0, bar: 1};
    extend(obj, {foo: 2});
    expect(obj).to.deep.equal({foo: 2, bar: 1});
  });
});

describe('addClass', () => {
  it('adds the given class name to the given element', () => {
    expect(hasClass(document.body, 'add-class-test')).to.be.false;
    addClass(document.body, 'add-class-test');
    expect(hasClass(document.body, 'add-class-test')).to.be.true;
  });
});

describe('hasClass', () => {
  it('returns true if the element has the given class', () => {
    expect(hasClass(document.body, 'has-class-test')).to.be.false;
    document.body.setAttribute('class', 'has-class-test');
    expect(hasClass(document.body, 'has-class-test')).to.be.true;
  });
});

describe('removeClass', () => {
  it('removes the given class from the given element', () => {
    document.body.setAttribute('class', 'remove-class-test');
    expect(hasClass(document.body, 'remove-class-test')).to.be.true;
    removeClass(document.body, 'remove-class-test');
    expect(hasClass(document.body, 'remove-class-test')).to.be.false;
  });
});
