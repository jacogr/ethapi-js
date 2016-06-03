import BigNumber from 'bignumber.js';

import { inAddress, inBlockNumber, inData, inFilter, inHex, inNumber10, inNumber16, inOptions, outBlock, outAddress, outDate, outNumber, outReceipt } from './format';
import { isInstanceOf } from './types';

describe('util/format', () => {
  const address = '0x63cf90d3f0410092fc0fca41846f596223979195';

  describe('outAddress', () => {
    it('retuns the address as-is', () => {
      expect(outAddress(address)).to.equal(address);
    });
  });

  describe('outBlock', () => {
    it('formats a block with all the info converted', () => {
      expect(
        outBlock({
          author: address,
          miner: address,
          difficulty: '0x100',
          gasLimit: '0x101',
          gasUsed: '0x102',
          number: '0x103',
          nonce: '0x104',
          totalDifficulty: '0x105',
          timestamp: '0x57513668',
          extraData: 'someExtraStuffInHere'
        })
      ).to.deep.equal({
        author: address,
        miner: address,
        difficulty: new BigNumber('0x100'),
        gasLimit: new BigNumber('0x101'),
        gasUsed: new BigNumber('0x102'),
        number: new BigNumber('0x103'),
        nonce: new BigNumber('0x104'),
        totalDifficulty: new BigNumber('0x105'),
        timestamp: new Date('2016-06-03T07:48:56.000Z'),
        extraData: 'someExtraStuffInHere'
      });
    });
  });

  describe('outDate', () => {
    it('converts a second date in unix timestamp', () => {
      expect(outDate(0x57513668)).to.deep.equal(new Date('2016-06-03T07:48:56.000Z'));
    });
  });

  describe('outNumber', () => {
    it('returns a BigNumber equalling the value', () => {
      const bn = outNumber('0x123456');

      expect(isInstanceOf(bn, BigNumber)).to.be.true;
      expect(bn.toString(16)).to.equal('123456');
    });

    it('assumes 0 when ivalid input', () => {
      expect(outNumber().toString(16)).to.equal('0');
    });
  });

  describe('outReceipt', () => {
    it('formats a receipt with all the info converted', () => {
      expect(
        outReceipt({
          contractAddress: address,
          blockNumber: '0x100',
          cumulativeGasUsed: '0x101',
          gasUsed: '0x102',
          transactionIndex: '0x103',
          extraData: 'someExtraStuffInHere'
        })
      ).to.deep.equal({
        contractAddress: address,
        blockNumber: new BigNumber('0x100'),
        cumulativeGasUsed: new BigNumber('0x101'),
        gasUsed: new BigNumber('0x102'),
        transactionIndex: new BigNumber('0x103'),
        extraData: 'someExtraStuffInHere'
      });
    });
  });

  describe('inAddress', () => {
    const address = '63cf90d3f0410092fc0fca41846f596223979195';

    it('adds the leading 0x as required', () => {
      expect(inAddress(address)).to.equal(`0x${address}`);
    });

    it('returns verified addresses as-is', () => {
      expect(inAddress(`0x${address}`)).to.equal(`0x${address}`);
    });

    it('returns lowercase equivalents', () => {
      expect(inAddress(address.toUpperCase())).to.equal(`0x${address}`);
    });

    it('returns 0x on null addresses', () => {
      expect(inAddress()).to.equal('0x');
    });
  });

  describe('inBlockNumber()', () => {
    it('returns earliest as-is', () => {
      expect(inBlockNumber('earliest')).to.equal('earliest');
    });

    it('returns latest as-is', () => {
      expect(inBlockNumber('latest')).to.equal('latest');
    });

    it('returns pending as-is', () => {
      expect(inBlockNumber('pending')).to.equal('pending');
    });

    it('formats existing BigNumber into hex', () => {
      expect(inBlockNumber(new BigNumber(0x123456))).to.equal('0x123456');
    });

    it('formats hex strings into hex', () => {
      expect(inBlockNumber('0x123456')).to.equal('0x123456');
    });

    it('formats numbers into hex', () => {
      expect(inBlockNumber(0x123456)).to.equal('0x123456');
    });
  });

  describe('inData', () => {
    it('formats to hex', () => {
      expect(inData('123456')).to.equal('0x123456');
    });
  });

  describe('inHex', () => {
    it('leaves leading 0x as-is', () => {
      expect(inHex('0x123456')).to.equal('0x123456');
    });

    it('adds a leading 0x', () => {
      expect(inHex('123456')).to.equal('0x123456');
    });

    it('handles empty & null', () => {
      expect(inHex()).to.equal('0x');
      expect(inHex('')).to.equal('0x');
    });
  });

  describe('inFilter', () => {
    it('formats an filter options object with relevant entries converted', () => {
      expect(
        inFilter({
          address: address,
          fromBlock: 'latest',
          toBlock: 0x101,
          extraData: 'someExtraStuffInHere'
        })
      ).to.deep.equal({
        address: address,
        fromBlock: 'latest',
        toBlock: '0x101',
        extraData: 'someExtraStuffInHere'
      });
    });
  });

  describe('inNumber10()', () => {
    it('formats existing BigNumber into number', () => {
      expect(inNumber10(new BigNumber(123))).to.equal(123);
    });

    it('formats hex strings into decimal', () => {
      expect(inNumber10('0x0a')).to.equal(10);
    });

    it('formats numbers into number', () => {
      expect(inNumber10(123)).to.equal(123);
    });

    it('formats undefined into 0', () => {
      expect(inNumber10()).to.equal(0);
    });
  });

  describe('inNumber16()', () => {
    it('formats existing BigNumber into hex', () => {
      expect(inNumber16(new BigNumber(0x123456))).to.equal('0x123456');
    });

    it('formats hex strings into hex', () => {
      expect(inNumber16('0x123456')).to.equal('0x123456');
    });

    it('formats numbers into hex', () => {
      expect(inNumber16(0x123456)).to.equal('0x123456');
    });

    it('formats undefined into 0', () => {
      expect(inNumber16()).to.equal('0x0');
    });
  });

  describe('inOptions', () => {
    it('formats an options object with relevant entries converted', () => {
      expect(
        inOptions({
          from: address,
          to: address,
          gas: new BigNumber('0x100'),
          gasPrice: 0x101,
          value: 258,
          nonce: '0x104',
          extraData: 'someExtraStuffInHere'
        })
      ).to.deep.equal({
        from: address,
        to: address,
        gas: '0x100',
        gasPrice: '0x101',
        value: '0x102',
        nonce: '0x104',
        extraData: 'someExtraStuffInHere'
      });
    });
  });
});
