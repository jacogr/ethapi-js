import { TEST_HOST, TEST_PORT, endpointDescribe, mockRpc } from '../../test/mockRpc';

import JsonRpc from '../transport/jsonRpc';
import Personal from './personal';

const instance = new Personal(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Personal', () => {
  endpointDescribe(instance, 'personal');

  describe('unlockAccount', () => {
    let scope;

    beforeEach(() => {
      scope = mockRpc([{ method: 'personal_unlockAccount', reply: { result: [] } }]);
    });

    it('passes account, password & duration', () => {
      return instance
        .unlockAccount('account', 'password', 'duration')
        .then(() => {
          expect(scope.body.personal_unlockAccount.params).to.deep.equal(['account', 'password', 'duration']);
        });
    });

    it('provides a default duration when not specified', () => {
      return instance
        .unlockAccount('account', 'password')
        .then(() => {
          expect(scope.body.personal_unlockAccount.params).to.deep.equal(['account', 'password', 5]);
        });
    });
  });
});
