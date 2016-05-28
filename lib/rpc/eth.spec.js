import { TEST_HOST, TEST_PORT, endpointDescribe } from '../../test/mockRpc';

import JsonRpc from '../transport/JsonRpc';
import Eth from './eth';

const instance = new Eth(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Eth', () => {
  endpointDescribe(instance, 'eth');
});
