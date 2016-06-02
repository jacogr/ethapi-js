import BigNumber from 'bignumber.js';

import ethapi from '../../test/e2e/ethapi';
import { isAddress } from '../../test/types';

describe('ethapi.eth', () => {
  let blockNumber;

  describe('.accounts()', () => {
    it('returns the available accounts', () => {
      return ethapi.eth.accounts().then((accounts) => {
        accounts.forEach((account) => {
          expect(isAddress(account)).to.be.true;
        });
      });
    });
  });

  describe('.blockNumber()', () => {
    it('returns the current blockNumber', () => {
      return ethapi.eth.blockNumber().then((_blockNumber) => {
        blockNumber = _blockNumber;
        expect(blockNumber.gt(new BigNumber('0xabcde', 16))).to.be.true;
      });
    });
  });

  describe('.coinbase()', () => {
    it('returns the coinbase', () => {
      return ethapi.eth.coinbase().then((coinbase) => {
        expect(isAddress(coinbase)).to.be.true;
      });
    });
  });

  describe('.gasPrice()', () => {
    it('returns the current gasPrice', () => {
      return ethapi.eth.gasPrice().then((gasPrice) => {
        expect(gasPrice.gt(0)).to.be.true;
      });
    });
  });

  describe('.getBalance()', () => {
    const address = '0x63cf90d3f0410092fc0fca41846f596223979195';

    it('returns the balance for latest block', () => {
      return ethapi.eth.getBalance(address).then((balance) => {
        expect(balance.gt(0)).to.be.true;
      });
    });

    it('returns the balance for a very early block', () => {
      const atBlock = '0x65432';
      const atValue = '18e07120a6e164fee1b';

      return ethapi.eth
        .getBalance(address, atBlock)
        .then((balance) => {
          expect(balance.toString(16)).to.equal(atValue);
        })
        .catch((error) => {
          // Parity doesn't support pruned-at-block balance lookups
          expect(error.message).to.match(/32000 Unsupported request/);
        });
    });

    it('returns the balance for a recent/out-of-pruning-range block', () => {
      return ethapi.eth
        .getBalance(address, blockNumber.minus(1000))
        .then((balance) => {
          expect(balance.gt(0)).to.be.true;
        });
    });
  });
});
