import BigNumber from 'bignumber.js';

import { fromAddress, fromNumber } from './format';
import { toAddress, toBlockNumber, toHex, toNumber } from './format'; // eslint-disable-line no-duplicate-imports
import { isInstanceOf } from './types';

describe('util/format', () => {
  describe('fromAddress', () => {
    const address = '0x63cf90d3f0410092fc0fca41846f596223979195';

    it('retuns the address as-is', () => {
      expect(fromAddress(address)).to.equal(address);
    });
  });

  describe('fromNumber', () => {
    it('returns a BigNumber equalling the value', () => {
      const bn = fromNumber('0x123456');

      expect(isInstanceOf(bn, BigNumber)).to.be.true;
      expect(bn.toString(16)).to.equal('123456');
    });

    it('assumes 0 when ivalid input', () => {
      expect(fromNumber().toString(16)).to.equal('0');
    });
  });

  describe('toAddress', () => {
    const address = '63cf90d3f0410092fc0fca41846f596223979195';

    it('adds the leading 0x as required', () => {
      expect(toAddress(address)).to.equal(`0x${address}`);
    });

    it('returns verified addresses as-is', () => {
      expect(toAddress(`0x${address}`)).to.equal(`0x${address}`);
    });

    it('returns lowercase equivalents', () => {
      expect(toAddress(address.toUpperCase())).to.equal(`0x${address}`);
    });

    it('returns 0x on null addresses', () => {
      expect(toAddress()).to.equal('0x');
    });
  });

  describe('toBlockNumber()', () => {
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

  describe('toHex', () => {
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

  describe('toNumber()', () => {
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
