import ethapi from '../../../test/e2e/ethapi';

describe.only('ethapi.trace', () => {
  describe('.block', () => {
    it('returns the latest block', () => {
      return ethapi.trace.block().then((block) => {
        expect(block).to.be.ok;
      });
    });

    it('returns a specified block', () => {
      return ethapi.trace.block('0x65432').then((block) => {
        expect(block).to.be.ok;
      });
    });
  });
});
