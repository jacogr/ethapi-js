import { TEST_HOST, TEST_PORT, endpointDescribe } from '../../test/mockRpc';

import JsonRrp from '../transport/JsonRpc';
import Web3 from './web3';

const instance = new Web3(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Web3', () => {
  endpointDescribe(instance, 'web3');
});
