import { TEST_HOST, TEST_PORT, endpointDescribe } from '../../test/mockRpc';

import JsonRpc from '../transport/jsonRpc';
import Trace from './trace';

const instance = new Trace(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Trace', () => {
  endpointDescribe(instance, 'trace');
});
