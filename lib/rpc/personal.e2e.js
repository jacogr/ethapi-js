import ethapi from '../../test/ethapi';

import { isAddress } from '../../test/types';

describe('ethapi.personal', () => {
  const password = 'P@55word';
  let address;

  describe('.newAccount', () => {
    it('creates a new account', () => {
      return ethapi.personal.newAccount(password).then((_address) => {
        address = _address;
        expect(address).to.be.ok;
        expect(isAddress(address)).to.be.ok;
      });
    });
  });

  describe('.listAccounts', () => {
    it('has the newly-created account', () => {
      return ethapi.personal.listAccounts(password).then((accounts) => {
        expect(accounts).to.be.ok;
        expect(accounts.filter((_address) => _address === address)).to.deep.equal([address]);
        accounts.forEach((account) => {
          expect(isAddress(account)).to.be.true;
        });
      });
    });
  });

  describe('.unlockAccount', () => {
    it('unlocks the newly-created account', () => {
      return ethapi.personal.unlockAccount(address, password).then((result) => {
        expect(result).to.be.ok;
      });
    });
  });
});
