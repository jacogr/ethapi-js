import { TEST_HOST, TEST_PORT, endpointDescribe } from '../../test/mockRpc';

import JsonRpc from '../transport/jsonRpc';
import Db from './db';

const instance = new Db(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Db', () => {
  endpointDescribe(instance, 'db');
});
