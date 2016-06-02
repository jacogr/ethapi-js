import ethapi from '../../test/ethapi';
import { isAddress, isHexNumber } from '../../test/types';

describe('ethapi.eth', () => {
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
        expect(isHexNumber(blockNumber)).to.be.true;
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
});
