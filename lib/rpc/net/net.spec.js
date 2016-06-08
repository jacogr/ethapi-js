import { TEST_HOST, TEST_PORT, mockHttp } from '../../../test/mockRpc';
import { isBigNumber } from '../../../test/types';

import Http from '../../transport/http';
import Net from './net';

const instance = new Net(new Http(TEST_HOST, TEST_PORT));

describe('lib/Net', () => {
  describe('peerCount', () => {
    it('returns the connected peers, formatted', () => {
      mockHttp([{ method: 'net_peerCount', reply: { result: '0x123456' } }]);

      return instance.peerCount().then((count) => {
        expect(isBigNumber(count)).to.be.true;
        expect(count.eq(0x123456)).to.be.true;
      });
    });
  });
});
