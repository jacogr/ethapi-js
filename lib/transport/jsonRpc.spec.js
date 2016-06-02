import sinon from 'sinon';

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
    const ERROR = { code: -1, message: 'ERROR: RPC failure' };

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
      expect(error.message).to.match(/RPC failure/);
    });
  });

  describe('setDebug', () => {
    it('starts with disabled flag', () => {
      expect(transport._debug).to.be.false;
    });

    it('true flag switches on', () => {
      transport.setDebug(true);
      expect(transport._debug).to.be.true;
    });

    it('false flag switches off', () => {
      transport.setDebug(true);
      expect(transport._debug).to.be.true;
      transport.setDebug(false);
      expect(transport._debug).to.be.false;
    });

    describe('logging', () => {
      beforeEach(() => {
        sinon.spy(console, 'log');
        sinon.spy(console, 'error');
      });

      afterEach(() => {
        console.log.restore();
        console.error.restore();
      });

      it('logs the HTTP error', () => {
        const scope = mockRpc([{ method: 'eth_call', reply: {}, code: 500 }]);

        transport.setDebug(true);
        return transport
          .execute('eth_call')
          .catch(() => {
            expect(scope.isDone()).to.be.true;
            expect(console.error).to.be.called;
          });
      });

      it('logs the RPC error', () => {
        const scope = mockRpc([{ method: 'eth_call', reply: { error: 'test error' } }]);

        transport.setDebug(true);
        return transport
          .execute('eth_call')
          .catch(() => {
            expect(scope.isDone()).to.be.true;
            expect(console.error).to.be.called;
          });
      });

      it('logs the RPC result', () => {
        const scope = mockRpc([{ method: 'eth_call', reply: { result: '0x123456789' } }]);

        transport.setDebug(true);
        return transport
          .execute('eth_call')
          .then(() => {
            expect(scope.isDone()).to.be.true;
            expect(console.log).to.be.called;
          });
      });
    });
  });
});
