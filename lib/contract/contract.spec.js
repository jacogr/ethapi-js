import { TEST_HOST, TEST_PORT } from '../../test/mockRpc';

import EthAbi from 'ethabi-js';

import EthApi from '../ethApi';
import Contract from './contract';
import { isInstanceOf } from '../util/types';

const transport = new EthApi.Transports.JsonRpc(TEST_HOST, TEST_PORT);
const eth = new EthApi(transport);

describe('contract/Contract', () => {
  const ADDR = '0x0123456789';
  const ABI = [{
    type: 'function',
    name: 'test',
    inputs: [{ name: 'boolin', type: 'bool' }, { name: 'stringin', type: 'string' }],
    outputs: [{ name: 'output', type: 'uint' }]
  }];

  describe('constructor', () => {
    it('needs an EthAbi instance', () => {
      expect(() => new Contract()).to.throw(/EthApi needs to be provided/);
    });

    it('needs an ABI', () => {
      expect(() => new Contract(eth)).to.throw(/Object ABI needs/);
    });

    it('sets EthApi & parsed interface', () => {
      const contract = new Contract(eth, []);

      expect(contract.address).to.not.be.ok;
      expect(contract.eth).to.deep.equal(eth);
      expect(isInstanceOf(contract.abi, EthAbi)).to.be.ok;
    });
  });

  describe('at', () => {
    it('sets returns the instance & sets the address', () => {
      const contract = new Contract(eth, []);

      expect(contract.at('123')).to.deep.equal(contract);
      expect(contract.at('456').address).to.equal('456');
    });
  });

  describe('_encodeOptions', () => {
    const contract = new Contract(eth, ABI).at(ADDR);
    const func = contract.abi.functions[0];

    it('encodes the at address in to', () => {
      expect(
        contract._encodeOptions(func, {}, [true, 'jacogr']).to
      ).to.equal(ADDR);
    });

    it('allows the override to as specified', () => {
      expect(
        contract._encodeOptions(func, { to: '0xabc' }, [true, 'jacogr']).to
      ).to.equal('0xabc');
    });

    it('encodes the parameters into data', () => {
      expect(
        contract._encodeOptions(func, {}, [true, 'jacogr']
      ).data).to.equal('0x023562050000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000066a61636f67720000000000000000000000000000000000000000000000000000');
    });
  });
});
