import { TEST_HOST, TEST_PORT } from '../../test/mockRpc';

import EthApi from '../ethApi';
import JsonRpc from '../transport/jsonRpc';
import Contract from './contract';
import Instance from 'ethabi-js';
import { isInstanceOf } from '../util/types';

const transport = new JsonRpc(TEST_HOST, TEST_PORT);
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

      expect(contract.at).to.not.be.ok;
      expect(contract.eth).to.deep.equal(eth);
      // expect(isInstanceOf(contract.abi, Instance)).to.be.ok;
    });
  });
});
