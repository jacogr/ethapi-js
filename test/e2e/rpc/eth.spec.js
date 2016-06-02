import ethapi from '../../ethapi';

describe('ethapi.eth.accounts()', () => {
  it('returns the available accounts', () => {
    return ethapi.eth
      .accounts()
      .then((accounts) => {
        expect(accounts).to.be.ok;
      });
  });
});

describe('ethapi.eth.blockNumber()', () => {
  it('returns the current blockNumber', () => {
    return ethapi.eth
      .blockNumber()
      .then((blockNumber) => {
        expect(blockNumber).to.be.ok;
      });
  });
});
