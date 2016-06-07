import { TEST_WS, mockWs } from '../../../test/mockRpc';
import Ws from './ws';

describe('transport/Ws', () => {
  let transport;
  let scope;

  beforeEach(() => {
    scope = mockWs([{ method: 'web3_clientVersion', reply: 'AClient' }]);
    transport = new Ws(TEST_WS);
  });

  afterEach(() => {
    scope.stop();
  });

  it('allows a call via WebSocket', () => {
    return transport.execute('web3_clientVersion').then((version) => {
      expect(scope.isDone()).to.be.true;
      expect(transport.isOpen).to.be.false;
      expect(version).to.equal('AClient');
    });
  });

  it('allows a call with parametsr via WebSocket', () => {
    return transport.execute('web3_clientVersion', 'some', 'basic', 'params').then((version) => {
      expect(scope.isDone()).to.be.true;
      expect(scope.body.web3_clientVersion.params).to.deep.equal(['some', 'basic', 'params']);
    });
  });
});
