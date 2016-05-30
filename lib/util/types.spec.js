import { isFunction, isInstanceOf } from './types';
import Eth from '../rpc/eth';

describe('util/types', () => {
  describe('isFunction', () => {
    it('correctly identifies null as false', () => {
      expect(isFunction(null)).to.be.false;
    });

    it('correctly identifies inline as true', () => {
      expect(isFunction(() => true)).to.be.true;
    });

    it('correctly identifies defined as true', () => {
      function testFunc () { return true; }

      expect(isFunction(testFunc)).to.be.true;
    });
  });

  describe('isInstanceOf', () => {
    it('correctly identifies build-in instanceof', () => {
      expect(isInstanceOf(new String('123'), String)).to.be.true; // eslint-disable-line no-new-wrappers
    });

    it('correctly identifies own instanceof', () => {
      expect(isInstanceOf(new Eth({}), Eth)).to.be.true;
    });

    it('correctly reports false for own', () => {
      expect(isInstanceOf({ call: () => true }, Eth)).to.be.false;
    });
  });
});
