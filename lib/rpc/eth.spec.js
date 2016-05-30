import { TEST_HOST, TEST_PORT, endpointDescribe, mockRpc } from '../../test/mockRpc';

import JsonRpc from '../transport/jsonRpc';
import Eth from './eth';

const instance = new Eth(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Eth', () => {
  endpointDescribe(instance, 'eth');

  describe('call', () => {
    let scope;

    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_call', reply: { result: [] } }]);
    });

    it('options & blockNumber', () => {
      return instance
        .call('options', 'blockNumber')
        .then(() => {
          expect(scope.body.eth_call.params).to.deep.equal(['options', 'blockNumber']);
        });
    });

    it('provides a latest blockNumber when not specified', () => {
      return instance
        .call('options')
        .then(() => {
          expect(scope.body.eth_call.params).to.deep.equal(['options', 'latest']);
        });
    });
  });
});
