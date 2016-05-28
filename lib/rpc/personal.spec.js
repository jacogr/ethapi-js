import { TEST_HOST, TEST_PORT, endpointDescribe } from '../../test/mockRpc';

import JsonRpc from '../transport/jsonRpc';
import Personal from './personal';

const instance = new Personal(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Personal', () => {
  endpointDescribe(instance, 'personal');
});
