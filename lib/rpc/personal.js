import { outAddress } from '../util/format';
import { inAddress, inNumber } from '../util/format'; // eslint-disable-line no-duplicate-imports

export default class Personal {
  constructor (transport) {
    this._transport = transport;
  }

  listAccounts () {
    return this._transport
      .execute('personal_listAccounts')
      .then((accounts) => (accounts || []).map(outAddress));
  }

  newAccount (password) {
    return this._transport
      .execute('personal_newAccount', password)
      .then(outAddress);
  }

  signAndSendTransaction (txObject, password) {
    return this._transport
      .execute('personal_signAndSendTransaction', txObject, password);
  }

  unlockAccount (account, password, duration = 5) {
    return this._transport
      .execute('personal_unlockAccount', inAddress(account), password, inNumber(duration));
  }
}
