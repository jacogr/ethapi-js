export default class Personal {
  constructor (transport) {
    this._transport = transport;
  }

  listAccounts () {
    return this._transport.execute('personal_listAccounts');
  }

  newAccount (password) {
    return this._transport.execute('personal_newAccount', password);
  }

  unlockAccount (account, password, duration = 5) {
    return this._transport.execute('personal_unlockAccount', account, password, duration);
  }
}
