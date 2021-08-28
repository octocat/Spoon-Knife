import Tether from '../../src/js/tether';

import {expect} from 'chai'

describe('Tether', () => {
  describe('constructor', () => {
    it('throws an error when the target and element are not specified', () => {
      expect(() => {
        new Tether({})
      }).to.throw(Error)
    })
  });

  describe('Utils', () => {
    it('expose utility methods and constructors', () => {
      expect(Tether.Utils).to.be.an('object')
      expect(Tether.Utils.getScrollParents).to.be.a('function')
      expect(Tether.Utils.getBounds).to.be.a('function')
      expect(Tether.Utils.getOffsetParent).to.be.a('function')
      expect(Tether.Utils.extend).to.be.a('function')
      expect(Tether.Utils.addClass).to.be.a('function')
      expect(Tether.Utils.removeClass).to.be.a('function')
      expect(Tether.Utils.hasClass).to.be.a('function')
      expect(Tether.Utils.updateClasses).to.be.a('function')
      expect(Tether.Utils.defer).to.be.a('function')
      expect(Tether.Utils.flush).to.be.a('function')
      expect(Tether.Utils.uniqueId).to.be.a('function')
      expect(Tether.Utils.Evented).to.be.a('function')
      expect(Tether.Utils.getScrollBarSize).to.be.a('function')
      expect(Tether.Utils.removeUtilElements).to.be.a('function')
    })
  })

  describe('getClass', () => {}); // TODO: write tests
  describe('setOptions', () => {}); // TODO: write tests
  describe('getTargetBounds', () => {}); // TODO: write tests
  describe('clearCache', () => {}); // TODO: write tests
  describe('cache', () => {}); // TODO: write tests
  describe('enable', () => {}); // TODO: write tests
  describe('disable', () => {}); // TODO: write tests
  describe('destroy', () => {}); // TODO: write tests
  describe('updateAttachClasses', () => {}); // TODO: write tests
  describe('position', () => {}); // TODO: write tests
  describe('move', () => {}); // TODO: write tests
});
