import { TEST_HOST, TEST_PORT, mockRpc } from '../../../test/mockRpc';

import Http from '../../transport/http';
import Trace from './trace';

const instance = new Trace(new Http(TEST_HOST, TEST_PORT));

describe('lib/Trace', () => {
  let scope;

  describe('block', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'trace_block', reply: { result: [] } }]);
    });

    it('assumes latest blockNumber when not specified', () => {
      return instance.block().then(() => {
        expect(scope.body.trace_block.params).to.deep.equal(['latest']);
      });
    });

    it('passed specified blockNumber', () => {
      return instance.block(0x123).then(() => {
        expect(scope.body.trace_block.params).to.deep.equal(['0x123']);
      });
    });
  });
});
