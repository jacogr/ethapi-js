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

  putHex (dbName, keyName, hexData) {
    return this._transport.execute('db_putHex', dbName, keyName, hexData);
  }

  putString (dbName, keyName, stringData) {
    return this._transport.execute('db_putString', dbName, keyName, stringData);
  }
}
