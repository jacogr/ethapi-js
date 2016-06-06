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

    it('formats the input options & blockNumber', () => {
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

  describe('gasPrice', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_gasPrice', reply: { result: '0x123' } }]);
    });

    it('returns the fomratted price', () => {
      return instance.gasPrice().then((price) => {
        expect(isBigNumber(price)).to.be.true;
        expect(price.toString(16)).to.deep.equal('123');
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

    it('formats the input hash as a hash, full true', () => {
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

  describe('getBlockByNumber', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_getBlockByNumber', reply: { result: { miner: address.toLowerCase() } } }]);
    });

    it('assumes blockNumber latest & full false', () => {
      return instance.getBlockByNumber().then(() => {
        expect(scope.body.eth_getBlockByNumber.params).to.deep.equal(['latest', false]);
      });
    });

    it('uses input blockNumber & full false', () => {
      return instance.getBlockByNumber('0x1234').then(() => {
        expect(scope.body.eth_getBlockByNumber.params).to.deep.equal(['0x1234', false]);
      });
    });

    it('formats the input blockNumber, full true', () => {
      return instance.getBlockByNumber(0x1234, true).then(() => {
        expect(scope.body.eth_getBlockByNumber.params).to.deep.equal(['0x1234', true]);
      });
    });

    it('formats the output into block', () => {
      return instance.getBlockByNumber(0x1234).then((block) => {
        expect(block.miner).to.equal(address);
      });
    });
  });

  describe('getBlockTransactionCountByHash', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_getBlockTransactionCountByHash', reply: { result: '0x123' } }]);
    });

    it('formats input hash properly', () => {
      return instance.getBlockTransactionCountByHash('abcdef').then(() => {
        expect(scope.body.eth_getBlockTransactionCountByHash.params).to.deep.equal(['0xabcdef']);
      });
    });

    it('formats the output number', () => {
      return instance.getBlockTransactionCountByHash('0x1234').then((count) => {
        expect(isBigNumber(count)).to.be.true;
        expect(count.toString(16)).to.equal('123');
      });
    });
  });

  describe('getBlockTransactionCountByNumber', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_getBlockTransactionCountByNumber', reply: { result: '0x123' } }]);
    });

    it('specified blockNumber latest when none specified', () => {
      return instance.getBlockTransactionCountByNumber().then(() => {
        expect(scope.body.eth_getBlockTransactionCountByNumber.params).to.deep.equal(['latest']);
      });
    });

    it('formats input blockNumber properly', () => {
      return instance.getBlockTransactionCountByNumber(0xabcdef).then(() => {
        expect(scope.body.eth_getBlockTransactionCountByNumber.params).to.deep.equal(['0xabcdef']);
      });
    });

    it('formats the output number', () => {
      return instance.getBlockTransactionCountByNumber('0x1234').then((count) => {
        expect(isBigNumber(count)).to.be.true;
        expect(count.toString(16)).to.equal('123');
      });
    });
  });

  describe('getCode', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_getCode', reply: { result: '0x1234567890' } }]);
    });

    it('passes in the address (default blockNumber)', () => {
      return instance.getCode(address).then(() => {
        expect(scope.body.eth_getCode.params).to.deep.equal([address.toLowerCase(), 'latest']);
      });
    });

    it('passes in the address & blockNumber', () => {
      return instance.getCode(address, 0x456).then(() => {
        expect(scope.body.eth_getCode.params).to.deep.equal([address.toLowerCase(), '0x456']);
      });
    });

    it('returns the code', () => {
      return instance.getCode(address, 0x123).then((code) => {
        expect(code).to.equal('0x1234567890');
      });
    });
  });

  describe('getStorageAt', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_getStorageAt', reply: { result: '0x1234567890' } }]);
    });

    it('passes in the address (default index& blockNumber)', () => {
      return instance.getStorageAt(address).then(() => {
        expect(scope.body.eth_getStorageAt.params).to.deep.equal([address.toLowerCase(), '0x0', 'latest']);
      });
    });

    it('passes in the address, index & blockNumber', () => {
      return instance.getStorageAt(address, 15, 0x456).then(() => {
        expect(scope.body.eth_getStorageAt.params).to.deep.equal([address.toLowerCase(), '0xf', '0x456']);
      });
    });

    it('returns the storage', () => {
      return instance.getStorageAt(address, 0x123).then((storage) => {
        expect(storage).to.equal('0x1234567890');
      });
    });
  });

  describe('getTransactionByBlockHashAndIndex', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_getTransactionByBlockHashAndIndex', reply: { result: { to: address.toLowerCase() } } }]);
    });

    it('passes in the hash (default index)', () => {
      return instance.getTransactionByBlockHashAndIndex('12345').then(() => {
        expect(scope.body.eth_getTransactionByBlockHashAndIndex.params).to.deep.equal(['0x12345', '0x0']);
      });
    });

    it('passes in the hash & specified index', () => {
      return instance.getTransactionByBlockHashAndIndex('6789', 0x456).then(() => {
        expect(scope.body.eth_getTransactionByBlockHashAndIndex.params).to.deep.equal(['0x6789', '0x456']);
      });
    });

    it('returns the formatted transaction', () => {
      return instance.getTransactionByBlockHashAndIndex('6789', 0x123).then((tx) => {
        expect(tx).to.deep.equal({ to: address });
      });
    });
  });

  describe('getTransactionByBlockNumberAndIndex', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_getTransactionByBlockNumberAndIndex', reply: { result: { to: address.toLowerCase() } } }]);
    });

    it('passes in the default parameters', () => {
      return instance.getTransactionByBlockNumberAndIndex().then(() => {
        expect(scope.body.eth_getTransactionByBlockNumberAndIndex.params).to.deep.equal(['latest', '0x0']);
      });
    });

    it('passes in the blockNumber & specified index', () => {
      return instance.getTransactionByBlockNumberAndIndex('0x6789', 0x456).then(() => {
        expect(scope.body.eth_getTransactionByBlockNumberAndIndex.params).to.deep.equal(['0x6789', '0x456']);
      });
    });

    it('returns the formatted transaction', () => {
      return instance.getTransactionByBlockNumberAndIndex('0x6789', 0x123).then((tx) => {
        expect(tx).to.deep.equal({ to: address });
      });
    });
  });

  describe('getTransactionByHash', () => {
    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_getTransactionByHash', reply: { result: { to: address.toLowerCase() } } }]);
    });

    it('passes in the hash', () => {
      return instance.getTransactionByHash('12345').then(() => {
        expect(scope.body.eth_getTransactionByHash.params).to.deep.equal(['0x12345']);
      });
    });

    it('returns the formatted transaction', () => {
      return instance.getTransactionByHash('6789').then((tx) => {
        expect(tx).to.deep.equal({ to: address });
      });
    });
  });
});
