import { TEST_HOST, TEST_PORT, endpointDescribe } from '../../test/mockRpc';

import JsonRpc from '../transport/JsonRpc';
import Shh from './shh';

const instance = new Shh(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Shh', () => {
  endpointDescribe(instance, 'shh');
});
