import { TEST_HOST, TEST_PORT, endpointDescribe } from '../../test/mockRpc';

import JsonRpc from '../transport/jsonRpc';
import Ethcore from './ethcore';

const instance = new Ethcore(new JsonRpc(TEST_HOST, TEST_PORT));

describe('lib/Ethcore', () => {
  endpointDescribe(instance, 'ethcore');
});
