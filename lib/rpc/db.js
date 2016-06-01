export default class Db {
  constructor (transport) {
    this._transport = transport;
  }

  getHex (dbName, keyName) {
    return this._transport.execute('db_getHex', dbName, keyName);
  }

  getString (dbName, keyName) {
    return this._transport.execute('db_getString', dbName, keyName);
  }

  putHex (dbName, keyName, dataHex) {
    return this._transport.execute('db_putHex', dbName, keyName, dataHex);
  }

  putString (dbName, keyName, dataString) {
    return this._transport.execute('db_putString', dbName, keyName, dataString);
  }
}
