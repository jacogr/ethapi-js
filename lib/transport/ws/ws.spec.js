import { TEST_WS, mockWs } from '../../../test/mockRpc';
import Ws from './ws';

describe('transport/Ws', () => {
  let transport;
  let scope;

  beforeEach(() => {
    scope = mockWs([{ method: 'web3_clientVersion', reply: 'AClient' }]);
    transport = new Ws(TEST_WS);
  });

  it('allows a call via WebSocket', () => {
    return transport.execute('web3_clientVersion').then((version) => {
      expect(scope.isDone()).to.be.true;
      expect(version).to.equal('AClient');
    });
  });
});
