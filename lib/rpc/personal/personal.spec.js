import { TEST_HOST, TEST_PORT, endpointDescribe, mockRpc } from '../../../test/mockRpc';

import JsonRpc from '../../transport/jsonRpc';
import Personal from './personal';

const instance = new Personal(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Personal', () => {
  endpointDescribe(instance, 'personal');

  const account = '0x63cf90d3f0410092fc0fca41846f596223979195';

  describe('unlockAccount', () => {
    let scope;

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
