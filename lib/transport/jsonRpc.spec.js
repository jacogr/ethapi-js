import { TEST_HOST, TEST_PORT, mockRpc } from '../../test/mockRpc';
import JsonRpc from './jsonRpc';

const transport = new JsonRpc(TEST_HOST, TEST_PORT);

describe('transport/JsonRPC', () => {
  describe('container', () => {
    it('encodes the body correctly', () => {
      const bdy = transport._encodeBody('someMethod', ['param1', 'param2']);
      const enc = `{"jsonrpc":"2.0","method":"someMethod","params":["param1","param2"],"id":${transport._id - 1}}`;

      expect(bdy).to.equal(enc);
    });

    it('encodes the options correctly', () => {
      const opt = transport._encodeOptions('someMethod', ['param']);
      const enc = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': 65
        },
        body: `{"jsonrpc":"2.0","method":"someMethod","params":["param"],"id":${transport._id - 1}}`
      };

      expect(opt).to.deep.equal(enc);
    });

    it('properly constructs the endpoint', () => {
      expect(transport._getEndpoint()).to.equal(`http://${TEST_HOST}:${TEST_PORT}/`);
    });
  });

  describe('call', () => {
    const RESULT = ['this is some result'];

    let scope;
    let result;

    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_call', reply: { result: RESULT } }]);

      return transport
        .execute('eth_call', [1, 2, 3])
        .then((_result) => {
          result = _result;
        });
    });

    it('makes POST', () => {
      expect(scope.isDone()).to.be.true;
    });

    it('sets jsonrpc', () => {
      expect(scope.body.eth_call.jsonrpc).to.equal('2.0');
    });

    it('sets the method', () => {
      expect(scope.body.eth_call.method).to.equal('eth_call');
    });

    it('passes the params', () => {
      expect(scope.body.eth_call.params).to.deep.equal([[1, 2, 3]]);
    });

    it('increments the id', () => {
      expect(scope.body.eth_call.id).not.to.equal(0);
    });

    it('passes the actual result back', () => {
      expect(result).to.deep.equal(RESULT);
    });
  });

  describe('HTTP errors', () => {
    let scope;
    let error;

    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_call', reply: {}, code: 500 }]);

      return transport
        .execute('eth_call')
        .catch((_error) => {
          error = _error;
        });
    });

    it('returns HTTP errors as throws', () => {
      expect(scope.isDone()).to.be.true;
      expect(error.message).to.match(/Internal Server Error/);
    });
  });

  describe('RPC errors', () => {
    const ERROR = 'ERROR: RPC failure';

    let scope;
    let error;

    beforeEach(() => {
      scope = mockRpc([{ method: 'eth_call', reply: { error: ERROR } }]);

      return transport
        .execute('eth_call')
        .catch((_error) => {
          error = _error;
        });
    });

    it('returns RPC errors as throws', () => {
      expect(scope.isDone()).to.be.true;
      expect(error.message).to.equal(ERROR);
    });
  });
});
