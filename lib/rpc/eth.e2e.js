import BigNumber from 'bignumber.js';

import ethapi from '../../test/e2e/ethapi';
import { isAddress } from '../../test/types';

describe('ethapi.eth', () => {
  let latestBlockNumber;
  let latestBlockHash;

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
      return ethapi.eth.blockNumber().then((blockNumber) => {
        latestBlockNumber = blockNumber;
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

    it.skip('returns the balance for a very early block', () => {
      const atBlock = '0x65432';
      const atValue = '18e07120a6e164fee1b';

      return ethapi.eth
        .getBalance(address, atBlock)
        .then((balance) => {
          expect(balance.toString(16)).to.equal(atValue);
        })
        .catch((error) => {
          // Parity doesn't support pruned-before-block balance lookups
          expect(error.message).to.match(/Unsupported request/);
        });
    });

    it('returns the balance for a recent/out-of-pruning-range block', () => {
      return ethapi.eth
        .getBalance(address, latestBlockNumber.minus(1000))
        .then((balance) => {
          expect(balance.gt(0)).to.be.true;
        });
    });
  });

  describe('getBlockByNumber()', () => {
    it('returns the latest block', () => {
      return ethapi.eth.getBlockByNumber().then((block) => {
        expect(block).to.be.ok;
      });
    });

    it('returns a block by blockNumber', () => {
      return ethapi.eth.getBlockByNumber(latestBlockNumber).then((block) => {
        latestBlockHash = block.hash;
        expect(block).to.be.ok;
      });
    });

    it('returns a block by blockNumber (full)', () => {
      return ethapi.eth.getBlockByNumber(latestBlockNumber, true).then((block) => {
        expect(block).to.be.ok;
      });
    });
  });

  describe('getBlockByHash', () => {
    it('returns the specified block', () => {
      return ethapi.eth.getBlockByHash(latestBlockHash).then((block) => {
        expect(block).to.be.ok;
        expect(block.hash).to.equal(latestBlockHash);
      });
    });

    it('returns the specified block (full)', () => {
      return ethapi.eth.getBlockByHash(latestBlockHash, true).then((block) => {
        expect(block).to.be.ok;
        expect(block.hash).to.equal(latestBlockHash);
      });
    });
  });
});
