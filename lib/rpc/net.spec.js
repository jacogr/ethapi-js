import { TEST_HOST, TEST_PORT, endpointDescribe } from '../../test/mockRpc';

import JsonRpc from '../transport/jsonRpc';
import Net from './net';

const instance = new Net(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Net', () => {
  endpointDescribe(instance, 'net');
});
