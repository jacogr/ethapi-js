import { TEST_HOST, TEST_PORT, mockRpc } from '../../../test/mockRpc';
import { isBigNumber } from '../../../test/types';

import Http from '../../transport/http';
import Eth from './eth';

const instance = new Eth(new Http(TEST_HOST, TEST_PORT));

describe('lib/Eth', () => {
  const address = '0x63Cf90D3f0410092FC0fca41846f596223979195';
  let scope;

  describe('call', () => {
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

  describe('estimateGas', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_estimateGas', reply: { result: '0x123' } }]);
    });

    it('converts the options correctly', () => {
      return instance.estimateGas({ gas: 21000 }).then(() => {
        expect(scope.body.eth_estimateGas.params).to.deep.equal([{ gas: '0x5208' }]);
      });
    });

    it('returns the gas used', () => {
      return instance.estimateGas({}).then((gas) => {
        expect(isBigNumber(gas)).to.be.true;
        expect(gas.toString(16)).to.deep.equal('123');
      });
    });
  });

  describe('getBalance', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_getBalance', reply: { result: '0x123' } }]);
    });

    it('passes in the address (default blockNumber)', () => {
      return instance.getBalance(address).then(() => {
        expect(scope.body.eth_getBalance.params).to.deep.equal([address.toLowerCase(), 'latest']);
      });
    });

    it('passes in the address & blockNumber', () => {
      return instance.getBalance(address, 0x456).then(() => {
        expect(scope.body.eth_getBalance.params).to.deep.equal([address.toLowerCase(), '0x456']);
      });
    });

    it('returns the balance', () => {
      return instance.getBalance(address, 0x123).then((balance) => {
        expect(isBigNumber(balance)).to.be.true;
        expect(balance.toString(16)).to.deep.equal('123');
      });
    });
  });

  describe('getBlockByHash', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_getBlockByHash', reply: { result: { miner: address.toLowerCase() } } }]);
    });

    it('formats the input hash as a hash, default full', () => {
      return instance.getBlockByHash('1234').then(() => {
        expect(scope.body.eth_getBlockByHash.params).to.deep.equal(['0x1234', false]);
      });
    });

    it('formats the input hash as a hash, default full = true', () => {
      return instance.getBlockByHash('1234', true).then(() => {
        expect(scope.body.eth_getBlockByHash.params).to.deep.equal(['0x1234', true]);
      });
    });

    it('formats the output into block', () => {
      return instance.getBlockByHash('1234').then((block) => {
        expect(block.miner).to.equal(address);
      });
    });
  });
});
