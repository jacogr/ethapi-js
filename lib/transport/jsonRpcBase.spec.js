import JsonRpcBase from './jsonRpcBase';

const base = new JsonRpcBase();

describe('base/JsonRpcBase', () => {
  describe('encode', () => {
    it('encodes the body correctly, incrementing id', () => {
      const id = base.id;
      const bdy = base.encode('someMethod', ['param1', 'param2']);
      const enc = `{"jsonrpc":"2.0","method":"someMethod","params":["param1","param2"],"id":${id}}`;

      expect(bdy).to.equal(enc);
      expect(base.id - id).to.equal(1);
    });
  });

  describe('setDebug', () => {
    it('starts with disabled flag', () => {
      expect(base.isDebug).to.be.false;
    });

    it('true flag switches on', () => {
      base.setDebug(true);
      expect(base.isDebug).to.be.true;
    });

    it('false flag switches off', () => {
      base.setDebug(true);
      expect(base.isDebug).to.be.true;
      base.setDebug(false);
      expect(base.isDebug).to.be.false;
    });
  });
});
