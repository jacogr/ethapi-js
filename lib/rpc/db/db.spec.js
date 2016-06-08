import { TEST_HOST, TEST_PORT, mockHttp } from '../../../test/mockRpc';

import Http from '../../transport/http';
import Db from './db';

const instance = new Db(new Http(TEST_HOST, TEST_PORT));

describe('lib/Db', () => {
  let scope;

  describe('putHex', () => {
    beforeEach(() => {
      scope = mockHttp([{ method: 'db_putHex', reply: { result: [] } }]);
    });

    it('formats the inputs correctly', () => {
      return instance.putHex('db', 'key', '1234').then(() => {
        expect(scope.body.db_putHex.params).to.deep.equal(['db', 'key', '0x1234']);
      });
    });
  });
});
