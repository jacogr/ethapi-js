import { fromAddress } from '../util/format';
import { toAddress, toNumber } from '../util/format'; // eslint-disable-line no-duplicate-imports

export default class Personal {
  constructor (transport) {
    this._transport = transport;
  }

  listAccounts () {
    return this._transport
      .execute('personal_listAccounts')
      .then((accounts) => (accounts || []).map(fromAddress));
  }

  newAccount (password) {
    return this._transport
      .execute('personal_newAccount', password)
      .then(fromAddress);
  }

  signAndSendTransaction (txObject, password) {
    return this._transport
      .execute('personal_signAndSendTransaction', txObject, password);
  }

  unlockAccount (account, password, duration = 5) {
    return this._transport
      .execute('personal_unlockAccount', toAddress(account), password, toNumber(duration));
  }
}
