import JsonRpcBase from './jsonRpcBase';

const base = new JsonRpcBase();

describe('transport/JsonRpcBase', () => {
  describe('encode', () => {
    it('encodes the body correctly', () => {
      const bdy = base.encode('someMethod', ['param1', 'param2']);
      const enc = `{"jsonrpc":"2.0","method":"someMethod","params":["param1","param2"],"id":${base._id - 1}}`;

      expect(bdy).to.equal(enc);
    });
  });
});
