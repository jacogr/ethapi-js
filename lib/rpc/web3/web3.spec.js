import { TEST_HOST, TEST_PORT, mockHttp } from '../../../test/mockRpc';

import Http from '../../transport/http';
import Web3 from './web3';

const instance = new Web3(new Http(TEST_HOST, TEST_PORT));

describe('lib/Web3', () => {
  let scope;

  describe('sha3', () => {
    beforeEach(() => {
      scope = mockHttp([{ method: 'web3_sha3', reply: { result: [] } }]);
    });

    it('formats the inputs correctly', () => {
      return instance.sha3('1234').then(() => {
        expect(scope.body.web3_sha3.params).to.deep.equal(['0x1234']);
      });
    });
  });
});
