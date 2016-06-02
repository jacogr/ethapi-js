import BigNumber from 'bignumber.js';

import { fromNumber } from './format';
import { toBlockNumber, toHexNumber } from './format'; // eslint-disable-line no-duplicate-imports
import { isInstanceOf } from './types';

describe('util/format', () => {
  describe('.fromNumber', () => {
    it('returns a BigNumber equalling the value', () => {
      const bn = fromNumber('0x123456');

      expect(isInstanceOf(bn, BigNumber)).to.be.true;
      expect(bn.toString(16)).to.equal('123456');
    });
  });

  describe('.toBlockNumber()', () => {
    it('returns earliest as-is', () => {
      expect(toBlockNumber('earliest')).to.equal('earliest');
    });

    it('returns latest as-is', () => {
      expect(toBlockNumber('latest')).to.equal('latest');
    });

    it('returns pending as-is', () => {
      expect(toBlockNumber('pending')).to.equal('pending');
    });

    it('formats existing BigNumber into hex', () => {
      expect(toBlockNumber(new BigNumber(0x123456))).to.equal('0x123456');
    });

    it('formats hex strings into hex', () => {
      expect(toBlockNumber('0x123456')).to.equal('0x123456');
    });

    it('formats numbers into hex', () => {
      expect(toBlockNumber(0x123456)).to.equal('0x123456');
    });
  });

  describe('.toHexNumber()', () => {
    it('formats existing BigNumber into hex', () => {
      expect(toHexNumber(new BigNumber(0x123456))).to.equal('0x123456');
    });

    it('formats hex strings into hex', () => {
      expect(toHexNumber('0x123456')).to.equal('0x123456');
    });

    it('formats numbers into hex', () => {
      expect(toHexNumber(0x123456)).to.equal('0x123456');
    });
  });
});
