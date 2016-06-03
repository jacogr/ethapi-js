import { TEST_HOST, TEST_PORT, mockRpc } from '../../../test/mockRpc';

import JsonRpc from '../../transport/jsonRpc';
import Personal from './personal';

const instance = new Personal(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Personal', () => {
  const account = '0x63cf90d3f0410092fc0fca41846f596223979195';
  let scope;

  describe('listAccounts', () => {
    it('retrieves a list of available accounts', () => {
      scope = mockRpc([{ method: 'personal_listAccounts', reply: { result: [account] } }]);

      return instance
        .listAccounts()
        .then((result) => {
          expect(result).to.deep.equal([account]);
        });
    });

    it('returns an empty list when none available', () => {
      scope = mockRpc([{ method: 'personal_listAccounts', reply: { result: null } }]);

      return instance
        .listAccounts()
        .then((result) => {
          expect(result).to.deep.equal([]);
        });
    });
  });

  describe('newAccount', () => {
    it('passes the password, returning the address', () => {
      scope = mockRpc([{ method: 'personal_newAccount', reply: { result: account } }]);

      return instance
        .newAccount('password')
        .then((result) => {
          expect(scope.body.personal_newAccount.params).to.deep.equal(['password']);
          expect(result).to.equal(account);
        });
    });
  });

  describe('unlockAccount', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'personal_unlockAccount', reply: { result: [] } }]);
    });

    it('passes account, password & duration', () => {
      return instance
        .unlockAccount(account, 'password', 0xf)
        .then(() => {
          expect(scope.body.personal_unlockAccount.params).to.deep.equal([account, 'password', 15]);
        });
    });

    it('provides a default duration when not specified', () => {
      return instance
        .unlockAccount(account, 'password')
        .then(() => {
          expect(scope.body.personal_unlockAccount.params).to.deep.equal([account, 'password', 1]);
        });
    });
  });
});
