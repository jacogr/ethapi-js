import ethapi from '../../test/ethapi';
import { isAddress, isHexNumber } from '../../test/types';

describe('ethapi.eth', () => {
  describe('.accounts()', () => {
    it('returns the available accounts', () => {
      return ethapi.eth.accounts().then((accounts) => {
        expect(accounts).to.be.ok;
        accounts.forEach((account) => {
          expect(isAddress(account)).to.be.true;
        });
      });
    });
  });

  describe('.blockNumber()', () => {
    it('returns the current blockNumber', () => {
      return ethapi.eth.blockNumber().then((blockNumber) => {
        expect(blockNumber).to.be.ok;
        expect(isHexNumber(blockNumber)).to.be.true;
      });
    });
  });
});
