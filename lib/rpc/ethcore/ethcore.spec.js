import { TEST_HOST, TEST_PORT, mockHttp } from '../../../test/mockRpc';
import { isBigNumber } from '../../../test/types';

import Http from '../../transport/http';
import Ethcore from './ethcore';

const instance = new Ethcore(new Http(TEST_HOST, TEST_PORT));

describe('lib/Ethcore', () => {
  describe('gasFloorTarget', () => {
    it('returns the gasfloor, formatted', () => {
      mockHttp([{ method: 'ethcore_gasFloorTarget', reply: { result: '0x123456' } }]);

      return instance.gasFloorTarget().then((count) => {
        expect(isBigNumber(count)).to.be.true;
        expect(count.eq(0x123456)).to.be.true;
      });
    });
  });

  describe('minGasPrice', () => {
    it('returns the min gasprice, formatted', () => {
      mockHttp([{ method: 'ethcore_minGasPrice', reply: { result: '0x123456' } }]);

      return instance.minGasPrice().then((count) => {
        expect(isBigNumber(count)).to.be.true;
        expect(count.eq(0x123456)).to.be.true;
      });
    });
  });

  describe('netMaxPeers', () => {
    it('returns the max peers, formatted', () => {
      mockHttp([{ method: 'ethcore_netMaxPeers', reply: { result: 25 } }]);

      return instance.netMaxPeers().then((count) => {
        expect(isBigNumber(count)).to.be.true;
        expect(count.eq(25)).to.be.true;
      });
    });
  });

  describe('netPort', () => {
    it('returns the connected port, formatted', () => {
      mockHttp([{ method: 'ethcore_netPort', reply: { result: 33030 } }]);

      return instance.netPort().then((count) => {
        expect(isBigNumber(count)).to.be.true;
        expect(count.eq(33030)).to.be.true;
      });
    });
  });

  describe('transactionsLimit', () => {
    it('returns the tx limit, formatted', () => {
      mockHttp([{ method: 'ethcore_transactionsLimit', reply: { result: 1024 } }]);

      return instance.transactionsLimit().then((count) => {
        expect(isBigNumber(count)).to.be.true;
        expect(count.eq(1024)).to.be.true;
      });
    });
  });
});
