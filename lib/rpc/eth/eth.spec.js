import { TEST_HOST, TEST_PORT, mockRpc } from '../../../test/mockRpc';

import JsonRpc from '../../transport/jsonRpc';
import Eth from './eth';

const instance = new Eth(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Eth', () => {
  describe('call', () => {
    let scope;

    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_call', reply: { result: [] } }]);
    });

    it('options & blockNumber', () => {
      return instance.call({ data: '12345678' }, 'earliest').then(() => {
        expect(scope.body.eth_call.params).to.deep.equal([{ data: '0x12345678' }, 'earliest']);
      });
    });

    it('provides a latest blockNumber when not specified', () => {
      return instance.call({ data: '12345678' }).then(() => {
        expect(scope.body.eth_call.params).to.deep.equal([{ data: '0x12345678' }, 'latest']);
      });
    });
  });
});
