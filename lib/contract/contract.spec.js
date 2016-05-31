import { TEST_HOST, TEST_PORT } from '../../test/mockRpc';

import EthAbi from 'ethabi-js';

import EthApi from '../ethApi';
import Contract from './contract';
import { isInstanceOf } from '../util/types';

const transport = new EthApi.Transports.JsonRpc(TEST_HOST, TEST_PORT);
const eth = new EthApi(transport);

describe('contract/Contract', () => {
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
});
