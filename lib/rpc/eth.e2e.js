import ethapi from '../../test/ethapi';

describe('ethapi.eth', () => {
  describe('.accounts()', () => {
    it('returns the available accounts', () => {
      return ethapi.eth.accounts().then((accounts) => {
        expect(accounts).to.be.ok;
      });
    });
  });

  describe('.blockNumber()', () => {
    it('returns the current blockNumber', () => {
      return ethapi.eth.blockNumber().then((blockNumber) => {
        expect(blockNumber).to.be.ok;
      });
    });
  });
});
