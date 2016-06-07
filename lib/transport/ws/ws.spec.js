import { TEST_WS, mockWs } from '../../../test/mockRpc';
import Ws from './ws';

describe('transport/Ws', () => {
  let transport;
  let scope;

  beforeEach(() => {
    scope = mockWs([{ method: 'test_anyCall', reply: 'TestResult' }]);
    transport = new Ws(TEST_WS);
  });

  afterEach(() => {
    scope.stop();
  });

  it('allows a call via WebSocket', () => {
    return transport.execute('test_anyCall').then((result) => {
      expect(scope.isDone()).to.be.true;
      expect(transport.isOpen).to.be.false;
      expect(result).to.equal('TestResult');
    });
  });

  it('allows a call with parametsr via WebSocket', () => {
    return transport.execute('test_anyCall', 'some', 'basic', 'params').then((version) => {
      expect(scope.isDone()).to.be.true;
      expect(scope.body.test_anyCall.params).to.deep.equal(['some', 'basic', 'params']);
    });
  });
});
