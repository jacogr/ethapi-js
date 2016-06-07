import ethapi from '../../../test/e2e/ethapi';
import { isBoolean } from '../../../test/types';

describe('ethapi.net', () => {
  describe('listening', () => {
    it('returns the listening status', () => {
      return ethapi.net.listening().then((status) => {
        expect(isBoolean(status)).to.be.true;
      });
    });
  });

  describe('peerCount', () => {
    it('returns the peer count', () => {
      return ethapi.net.peerCount().then((count) => {
        expect(count.gte(0)).to.be.true;
      });
    });
  });

  describe('version', () => {
    it('returns the version', () => {
      return ethapi.net.version().then((version) => {
        expect(version).to.be.ok;
      });
    });
  });
});
