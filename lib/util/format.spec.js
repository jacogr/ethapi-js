import BigNumber from 'bignumber.js';

import { fromNumber } from './format';
import { toBlockNumber, toHex, toNumber } from './format'; // eslint-disable-line no-duplicate-imports
import { isInstanceOf } from './types';

describe('util/format', () => {
  describe('.fromNumber', () => {
    it('returns a BigNumber equalling the value', () => {
      const bn = fromNumber('0x123456');

      expect(isInstanceOf(bn, BigNumber)).to.be.true;
      expect(bn.toString(16)).to.equal('123456');
    });

    it('assumes 0 when ivalid input', () => {
      expect(fromNumber().toString(16)).to.equal('0');
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

  describe('.toHex', () => {
    it('leaves leading 0x as-is', () => {
      expect(toHex('0x123456')).to.equal('0x123456');
    });

    it('adds a leading 0x', () => {
      expect(toHex('123456')).to.equal('0x123456');
    });

    it('handles empty & null', () => {
      expect(toHex()).to.equal('0x');
      expect(toHex('')).to.equal('0x');
    });
  });

  describe('.toNumber()', () => {
    it('formats existing BigNumber into hex', () => {
      expect(toNumber(new BigNumber(0x123456))).to.equal('0x123456');
    });

    it('formats hex strings into hex', () => {
      expect(toNumber('0x123456')).to.equal('0x123456');
    });

    it('formats numbers into hex', () => {
      expect(toNumber(0x123456)).to.equal('0x123456');
    });

    it('formats undefined into 0', () => {
      expect(toNumber()).to.equal('0x0');
    });
  });
});
