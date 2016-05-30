import EthApi from './ethApi';

import { Eth, Net, Personal, Shh, Web3 } from './rpc';
import { isInstanceOf } from './util/types';

describe('lib/EthApi', () => {
  describe('constructor', () => {
    it('requires defined/non-null transport object', () => {
      expect(() => new EthApi()).to.throw(/EthAbi needs transport/);
      expect(() => new EthApi(null)).to.throw(/EthAbi needs transport/);
    });

    it('requires an execute function on the transport object', () => {
      expect(() => new EthApi({})).to.throw(/EthAbi needs transport/);
      expect(() => new EthApi({ execute: true })).to.throw(/EthAbi needs transport/);
    });

    describe('interface', () => {
      const api = new EthApi({ execute: () => false });

      it('creates and attaches eth', () => {
        expect(isInstanceOf(api.eth, Eth)).to.be.true;
      });

      it('creates and attaches net', () => {
        expect(isInstanceOf(api.net, Net)).to.be.true;
      });

      it('creates and attaches personal', () => {
        expect(isInstanceOf(api.personal, Personal)).to.be.true;
      });

      it('creates and attaches shh', () => {
        expect(isInstanceOf(api.shh, Shh)).to.be.true;
      });

      it('creates and attaches web3', () => {
        expect(isInstanceOf(api.web3, Web3)).to.be.true;
      });
    });
  });
});
