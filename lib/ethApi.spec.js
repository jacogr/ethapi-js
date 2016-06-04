import { TEST_HOST, TEST_PORT, endpointTest } from '../test/mockRpc';

import EthApi from './ethApi';

import ethereumRpc from 'ethereum-rpc-json/lib/rpc.json';

describe('lib/EthApi', () => {
  describe('constructor', () => {
    it('requires defined/non-null transport object', () => {
      expect(() => new EthApi()).to.throw(/EthApi needs transport/);
      expect(() => new EthApi(null)).to.throw(/EthApi needs transport/);
    });

    it('requires an execute function on the transport object', () => {
      expect(() => new EthApi({})).to.throw(/EthApi needs transport/);
      expect(() => new EthApi({ execute: true })).to.throw(/EthApi needs transport/);
    });
  });

  describe('interface', () => {
    const api = new EthApi(new EthApi.Transports.JsonRpc(TEST_HOST, TEST_PORT));

    const endpoints = {};
    ethereumRpc.methods.sort().forEach((entry) => {
      const [prefix, method] = entry.name.split('_');

      endpoints[prefix] = endpoints[prefix] || [];
      endpoints[prefix].push(method);
    });

    Object.keys(endpoints).forEach((endpoint) => {
      describe(endpoint, () => {
        endpoints[endpoint].sort().forEach((method) => {
          endpointTest(api, endpoint, method);
        });
      });
    });
  });
});
