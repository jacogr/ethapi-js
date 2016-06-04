import { inAddress, inData, inNumber16, outNumber } from '../../util/format';

export default class Ethcore {
  constructor (transport) {
    this._transport = transport;
  }

  defaultExtraData () {
    return this._transport
      .execute('ethcore_defaultExtraData');
  }

  devLogs () {
    return this._transport
      .execute('ethcore_devLogs');
  }

  devLogsLevels () {
    return this._transport
      .execute('ethcore_devLogsLevels');
  }

  extraData () {
    return this._transport
      .execute('ethcore_extraData');
  }

  gasFloorTarget () {
    return this._transport
      .execute('ethcore_gasFloorTarget')
      .then(outNumber);
  }

  minGasPrice () {
    return this._transport
      .execute('ethcore_minGasPrice')
      .then(outNumber);
  }

  netChain () {
    return this._transport
      .execute('ethcore_netChain');
  }

  netMaxPeers () {
    return this._transport
      .execute('ethcore_netMaxPeers')
      .then(outNumber);
  }

  netPort () {
    return this._transport
      .execute('ethcore_netPort')
      .then(outNumber);
  }

  nodeName () {
    return this._transport
      .execute('ethcore_nodeName');
  }

  setAuthor (address) {
    return this._transport
      .execute('ethcore_setAuthor', inAddress(address));
  }

  setExtraData (data) {
    return this._transport
      .execute('ethcore_setExtraData', inData(data));
  }

  setGasFloorTarget (quantity) {
    return this._transport
      .execute('ethcore_setGasFloorTarget', inNumber16(quantity));
  }

  setMinGasPrice (quantity) {
    return this._transport
      .execute('ethcore_setMinGasPrice', inNumber16(quantity));
  }

  setTransactionsLimit (quantity) {
    return this._transport
      .execute('ethcore_setTransactionsLimit', inNumber16(quantity));
  }

  transactionsLimit () {
    return this._transport
      .execute('ethcore_transactionsLimit')
      .then(outNumber);
  }

  rpcSettings () {
    return this._transport
      .execute('ethcore_rpcSettings');
  }
}
