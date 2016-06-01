import BigNumber from 'bignumber.js';

import { TEST_HOST, TEST_PORT, mockRpc } from '../../test/mockRpc';

import EthAbi from 'ethabi-js';

import EthApi from '../ethApi';
import Contract from './contract';
import { isInstanceOf, isFunction } from '../util/types';

const transport = new EthApi.Transports.JsonRpc(TEST_HOST, TEST_PORT);
const eth = new EthApi(transport);

describe('contract/Contract', () => {
  const ADDR = '0x0123456789';
  const ABI = [{
    type: 'function', name: 'test',
    inputs: [{ name: 'boolin', type: 'bool' }, { name: 'stringin', type: 'string' }],
    outputs: [{ type: 'uint' }]
  }, {
    type: 'function', name: 'test2',
    outputs: [{ type: 'uint' }, { type: 'uint' }]
  }, { type: 'constructor' }, { type: 'event', name: 'baz' }, { type: 'event', name: 'foo' }];
  const VALUES = [true, 'jacogr'];
  const ENCODED = '0x023562050000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000066a61636f67720000000000000000000000000000000000000000000000000000';
  const RETURN1 = '0000000000000000000000000000000000000000000000000000000000123456';
  const RETURN2 = '0000000000000000000000000000000000000000000000000000000000456789';

  describe('constructor', () => {
    it('needs an EthAbi instance', () => {
      expect(() => new Contract()).to.throw(/EthApi needs to be provided/);
    });

    it('needs an ABI', () => {
      expect(() => new Contract(eth)).to.throw(/Object ABI needs/);
    });

    describe('internal setup', () => {
      const contract = new Contract(eth, ABI);

      it('sets EthApi & parsed interface', () => {
        expect(contract.address).to.not.be.ok;
        expect(contract.eth).to.deep.equal(eth);
        expect(isInstanceOf(contract.abi, EthAbi)).to.be.ok;
      });

      it('attaches functions', () => {
        expect(contract.functions.length).to.equal(2);
        expect(contract.functions[0].name).to.equal('test');
      });

      it('attaches constructors', () => {
        expect(contract.constructors.length).to.equal(1);
      });

      it('attaches events', () => {
        expect(contract.events.length).to.equal(2);
        expect(contract.events[0].name).to.equal('baz');
      });
    });
  });

  describe('at', () => {
    it('sets returns the instance & sets the address', () => {
      const contract = new Contract(eth, []);

      expect(contract.at('123')).to.deep.equal(contract);
      expect(contract.at('456').address).to.equal('456');
    });
  });

  describe('parseTransactionEvents', () => {
    it('checks for unmatched signatures', () => {
      const contract = new Contract(eth, [{ anonymous: false, name: 'Message', type: 'event' }]);
      expect(() => contract.parseTransactionEvents({
        logs: [{
          data: '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000063cf90d3f0410092fc0fca41846f5962239791950000000000000000000000000000000000000000000000000000000056e6c85f0000000000000000000000000000000000000000000000000001000000004fcd00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000d706f7374286d6573736167652900000000000000000000000000000000000000',
          topics: [
            '0x954ba6c157daf8a26539574ffa64203c044691aa57251af95f4b48d85ec00dd5',
            '0x0000000000000000000000000000000000000000000000000001000000004fe0'
          ]
        }]
      })).to.throw(/event matching signature/);
    });

    it('parses a transaction log into the data', () => {
      const contract = new Contract(eth, [
        {
          anonymous: false, name: 'Message', type: 'event',
          inputs: [
            { indexed: true, name: 'postId', type: 'uint256' },
            { indexed: false, name: 'parentId', type: 'uint256' },
            { indexed: false, name: 'sender', type: 'address' },
            { indexed: false, name: 'at', type: 'uint256' },
            { indexed: false, name: 'messageId', type: 'uint256' },
            { indexed: false, name: 'message', type: 'string' }
          ]
        }
      ]);
      const decoded = contract.parseTransactionEvents({
        blockHash: '0xa9280530a3b47bee2fc80f2862fd56502ae075350571d724d6442ea4c597347b',
        blockNumber: '0x4fcd',
        cumulativeGasUsed: '0xb57f',
        gasUsed: '0xb57f',
        logs: [{
          address: '0x22bff18ec62281850546a664bb63a5c06ac5f76c',
          blockHash: '0xa9280530a3b47bee2fc80f2862fd56502ae075350571d724d6442ea4c597347b',
          blockNumber: '0x4fcd',
          data: '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000063cf90d3f0410092fc0fca41846f5962239791950000000000000000000000000000000000000000000000000000000056e6c85f0000000000000000000000000000000000000000000000000001000000004fcd00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000d706f7374286d6573736167652900000000000000000000000000000000000000',
          logIndex: '0x0',
          topics: [
            '0x954ba6c157daf8a26539574ffa64203c044691aa57251af95f4b48d85ec00dd5',
            '0x0000000000000000000000000000000000000000000000000001000000004fe0'
          ],
          transactionHash: '0xca16f537d761d13e4e80953b754e2b15541f267d6cad9381f750af1bae1e4917',
          transactionIndex: '0x0'
        }],
        to: '0x22bff18ec62281850546a664bb63a5c06ac5f76c',
        transactionHash: '0xca16f537d761d13e4e80953b754e2b15541f267d6cad9381f750af1bae1e4917',
        transactionIndex: '0x0'
      });

      expect(decoded.logs[0].params).to.deep.equal({
        at: new BigNumber('1457965151'),
        message: 'post(message)',
        messageId: new BigNumber('281474976731085'),
        parentId: new BigNumber(0),
        postId: new BigNumber('281474976731104'),
        sender: '63cf90d3f0410092fc0fca41846f596223979195'
      });
    });
  });

  describe('bindings', () => {
    let contract;
    let cons;
    let func;

    beforeEach(() => {
      contract = new Contract(eth, ABI).at(ADDR);
      cons = contract.constructors[0];
      func = contract.functions.find((fn) => fn.name === 'test');
    });

    describe('attachments', () => {
      it('attaches .call, .sendTransaction & .estimateGas to constructors', () => {
        expect(isFunction(cons.call)).to.be.true;
        expect(isFunction(cons.sendTransaction)).to.be.true;
        expect(isFunction(cons.estimateGas)).to.be.true;
      });

      it('attaches .call, .sendTransaction & .estimateGas to functions', () => {
        expect(isFunction(func.call)).to.be.true;
        expect(isFunction(func.sendTransaction)).to.be.true;
        expect(isFunction(func.estimateGas)).to.be.true;
      });
    });

    describe('sendTransaction', () => {
      let scope;

      beforeEach(() => {
        scope = mockRpc([{ method: 'eth_sendTransaction', reply: { result: ['hashId'] } }]);
      });

      it('encodes options and mades an eth_sendTransaction call', () => {
        return func
          .sendTransaction({ someExtras: 'foo' }, VALUES)
          .then(() => {
            expect(scope.isDone()).to.be.true;
            expect(scope.body.eth_sendTransaction.params[0]).to.deep.equal({
              someExtras: 'foo',
              to: ADDR,
              data: ENCODED
            });
          });
      });
    });

    describe('estimateGas', () => {
      let scope;

      beforeEach(() => {
        scope = mockRpc([{ method: 'eth_estimateGas', reply: { result: ['amount'] } }]);
      });

      it('encodes options and mades an eth_estimateGas call', () => {
        return func
          .estimateGas({ someExtras: 'foo' }, VALUES)
          .then(() => {
            expect(scope.isDone()).to.be.true;
            expect(scope.body.eth_estimateGas.params[0]).to.deep.equal({
              someExtras: 'foo',
              to: ADDR,
              data: ENCODED
            });
          });
      });
    });

    describe('call', () => {
      it('encodes options and mades an eth_call call', () => {
        const scope = mockRpc([{ method: 'eth_call', reply: { result: RETURN1 } }]);

        return func
          .call({ someExtras: 'foo' }, VALUES)
          .then((result) => {
            expect(scope.isDone()).to.be.true;
            expect(scope.body.eth_call.params[0]).to.deep.equal({
              someExtras: 'foo',
              to: ADDR,
              data: ENCODED
            });
            expect(result.toString(16)).to.equal('123456');
          });
      });

      it('encodes options and mades an eth_call call (multiple returns)', () => {
        const scope = mockRpc([{ method: 'eth_call', reply: { result: `${RETURN1}${RETURN2}` } }]);

        return contract.functions[1]
          .call({}, [])
          .then((result) => {
            expect(scope.isDone()).to.be.true;
            expect(result.length).to.equal(2);
            expect(result[0].toString(16)).to.equal('123456');
            expect(result[1].toString(16)).to.equal('456789');
          });
      });
    });
  });
});
