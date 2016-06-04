import { inAddress, inNumber10, inOptions, outAddress } from '../../util/format';

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

  signAndSendTransaction (options, password) {
    return this._transport
      .execute('personal_signAndSendTransaction', inOptions(options), password);
  }

  unlockAccount (account, password, duration = 1) {
    return this._transport
      .execute('personal_unlockAccount', inAddress(account), password, inNumber10(duration));
  }
}
