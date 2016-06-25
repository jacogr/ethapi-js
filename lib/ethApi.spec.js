import { TEST_HTTP_URL, endpointTest } from '../test/mockRpc';

import EthApi from './ethApi';

import ethereumRpc from 'ethereum-rpc-json';

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
    const api = new EthApi(new EthApi.Transport.Http(TEST_HTTP_URL));

    Object.keys(ethereumRpc).sort().forEach((endpoint) => {
      describe(endpoint, () => {
        Object.keys(ethereumRpc[endpoint]).sort().forEach((method) => {
          endpointTest(api, endpoint, method);
        });
      });
    });
  });
});
