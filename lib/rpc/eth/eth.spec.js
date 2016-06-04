import { TEST_HOST, TEST_PORT, mockRpc } from '../../../test/mockRpc';

import Http from '../../transport/http';
import Eth from './eth';

const instance = new Eth(new Http(TEST_HOST, TEST_PORT));

describe('lib/Eth', () => {
  describe('call', () => {
    let scope;

    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_call', reply: { result: [] } }]);
    });

    it('options & blockNumber', () => {
      return instance
        .call({ something: 'someThing' }, 'earliest')
        .then(() => {
          expect(scope.body.eth_call.params).to.deep.equal([{ something: 'someThing' }, 'earliest']);
        });
    });

    it('provides a latest blockNumber when not specified', () => {
      return instance
        .call({ something: 'someThing' })
        .then(() => {
          expect(scope.body.eth_call.params).to.deep.equal([{ something: 'someThing' }, 'latest']);
        });
    });
  });
});
