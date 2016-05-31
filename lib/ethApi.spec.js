import { TEST_HOST, TEST_PORT } from '../test/mockRpc';

import EthApi from './ethApi';

import { Eth, Net, Personal, Shh, Web3 } from './rpc';
import { isInstanceOf, isFunction } from './util/types';
import ethereumRpc from 'ethereum-rpc-json/lib/rpc.json';

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
  });

  describe.only('interface', () => {
    const api = new EthApi(new EthApi.Transports.JsonRpc(TEST_HOST, TEST_PORT));

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

    describe('ethereum-rpc-json', () => {
      const endpoints = {};
      ethereumRpc.methods.sort().forEach((entry) => {
        const [prefix, method] = entry.name.split('_');

        endpoints[prefix] = endpoints[prefix] || [];
        endpoints[prefix].push(method);
      });

      Object.keys(endpoints).forEach((endpoint) => {
        describe(endpoint, () => {
          it(`has the ${endpoint} endpoint`, () => {
            expect(api[endpoint]).to.be.ok;
          });

          describe('methods', () => {
            endpoints[endpoint].sort().forEach((method) => {
              it(`has ${method}`, () => {
                expect(isFunction(api[endpoint][method])).to.be.true;
              });
            });
          });
        });
      });
    });
  });
});
