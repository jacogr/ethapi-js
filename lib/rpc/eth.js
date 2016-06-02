import { fromNumber } from '../util/format';
import { toBlockNumber, toHex, toNumber } from '../util/format'; // eslint-disable-line no-duplicate-imports

export default class Eth {
  constructor (transport) {
    this._transport = transport;
  }

  accounts () {
    return this._transport
      .execute('eth_accounts');
  }

  blockNumber () {
    return this._transport
      .execute('eth_blockNumber')
      .then(fromNumber);
  }

  call (options, blockNumber = 'latest') {
    return this._transport
      .execute('eth_call', options, toBlockNumber(blockNumber));
  }

  coinbase () {
    return this._transport
      .execute('eth_coinbase');
  }

  compileLLL (code) {
    return this._transport
      .execute('eth_compileLLL', toHex(code));
  }

  compileSerpent (code) {
    return this._transport
      .execute('eth_compileSerpent', toHex(code));
  }

  compileSolidity (code) {
    return this._transport
      .execute('eth_compileSolidity', toHex(code));
  }

  estimateGas (options) {
    return this._transport
      .execute('eth_estimateGas', options)
      .then(fromNumber);
  }

  fetchQueuedTransactions () {
    return this._transport
      .execute('eth_fetchQueuedTransactions');
  }

  flush () {
    return this._transport
      .execute('eth_flush');
  }

  gasPrice () {
    return this._transport
      .execute('eth_gasPrice')
      .then(fromNumber);
  }

  getBalance (address, blockNumber = 'latest') {
    return this._transport
      .execute('eth_getBalance', toHex(address), toBlockNumber(blockNumber))
      .then(fromNumber);
  }

  getBlockByHash (hash, full = false) {
    return this._transport
      .execute('eth_getBlockByHash', toHex(hash), full);
  }

  getBlockByNumber (blockNumber = 'latest', full = false) {
    return this._transport
      .execute('eth_getBlockByNumber', toBlockNumber(blockNumber), full);
  }

  getBlockTransactionCountByHash (hash) {
    return this._transport
      .execute('eth_getBlockTransactionCountByHash', toHex(hash));
  }

  getBlockTransactionCountByNumber (blockNumber = 'latest') {
    return this._transport
      .execute('eth_getBlockTransactionCountByNumber', toBlockNumber(blockNumber));
  }

  getCode (address, blockNumber = 'latest') {
    return this._transport
      .execute('eth_getCode', toHex(address), toBlockNumber(blockNumber));
  }

  getCompilers () {
    return this._transport
      .execute('eth_getCompilers');
  }

  getFilterChanges (filterId) {
    return this._transport
      .execute('eth_getFilterChanges', toNumber(filterId));
  }

  getFilterChangesEx (filterId) {
    return this._transport
      .execute('eth_getFilterChangesEx', toNumber(filterId));
  }

  getFilterLogs (filterId) {
    return this._transport
      .execute('eth_getFilterLogs', toNumber(filterId));
  }

  getFilterLogsEx (filterId) {
    return this._transport
      .execute('eth_getFilterLogsEx', toNumber(filterId));
  }

  getLogs (options) {
    return this._transport
      .execute('eth_getLogs', options);
  }

  getLogsEx (options) {
    return this._transport
      .execute('eth_getLogsEx', options);
  }

  getStorageAt (address, index = 0, blockNumber = 'latest') {
    return this._transport
      .execute('eth_getStorageAt', toHex(address), toNumber(index), toBlockNumber(blockNumber));
  }

  getTransactionByBlockHashAndIndex (hash, index = 0) {
    return this._transport
      .execute('eth_getTransactionByBlockHashAndIndex', toHex(hash), toNumber(index));
  }

  getTransactionByBlockNumberAndIndex (blockNumber = 'latest', index = 0) {
    return this._transport
      .execute('eth_getTransactionByBlockNumberAndIndex', toBlockNumber(blockNumber), toNumber(index));
  }

  getTransactionByHash (hash) {
    return this._transport
      .execute('eth_getTransactionByHash', toHex(hash));
  }

  getTransactionCount (address, blockNumber = 'latest') {
    return this._transport
      .execute('eth_getTransactionCount', toHex(address), toBlockNumber(blockNumber));
  }

  getTransactionReceipt (txhash) {
    return this._transport
      .execute('eth_getTransactionReceipt', toHex(txhash));
  }

  getUncleByBlockHashAndIndex (hash, index = 0) {
    return this._transport
      .execute('eth_getUncleByBlockHashAndIndex', toHex(hash), toNumber(index));
  }

  getUncleByBlockNumberAndIndex (blockNumber = 'latest', index = 0) {
    return this._transport
      .execute('eth_getUncleByBlockNumberAndIndex', toBlockNumber(blockNumber), toNumber(index));
  }

  getUncleCountByBlockHash (hash) {
    return this._transport
      .execute('eth_getUncleCountByBlockHash', toHex(hash));
  }

  getUncleCountByBlockNumber (blockNumber = 'latest') {
    return this._transport
      .execute('eth_getUncleCountByBlockNumber', toBlockNumber(blockNumber));
  }

  getWork () {
    return this._transport
      .execute('eth_getWork');
  }

  hashrate () {
    return this._transport
      .execute('eth_hashrate')
      .then(toNumber);
  }

  inspectTransaction () {
    return this._transport
      .execute('eth_inspectTransaction');
  }

  mining () {
    return this._transport
      .execute('eth_mining');
  }

  newBlockFilter () {
    return this._transport
      .execute('eth_newBlockFilter');
  }

  newFilter (options) {
    return this._transport
      .execute('eth_newFilter', options);
  }

  newFilterEx (options) {
    return this._transport
      .execute('eth_newFilterEx', options);
  }

  newPendingTransactionFilter () {
    return this._transport
      .execute('eth_newPendingTransactionFilter');
  }

  notePassword () {
    return this._transport
      .execute('eth_notePassword');
  }

  pendingTransactions () {
    return this._transport
      .execute('eth_pendingTransactions');
  }

  protocolVersion () {
    return this._transport
      .execute('eth_protocolVersion');
  }

  register () {
    return this._transport
      .execute('eth_register');
  }

  sendRawTransaction (data) {
    return this._transport
      .execute('eth_sendRawTransaction', toHex(data));
  }

  sendTransaction (options) {
    return this._transport
      .execute('eth_sendTransaction', options);
  }

  sign () {
    return this._transport.execute('eth_sign');
  }

  signTransaction () {
    return this._transport
      .execute('eth_signTransaction');
  }

  submitHashrate (hashrate, clientId) {
    return this._transport
      .execute('eth_submitHashrate', fromNumber(hashrate), clientId);
  }

  submitWork (nonce, powHash, mixDigest) {
    return this._transport
      .execute('eth_submitWork', nonce, powHash, mixDigest);
  }

  syncing () {
    return this._transport
      .execute('eth_syncing');
  }

  uninstallFilter (filterId) {
    return this._transport
      .execute('eth_uninstallFilter', toHex(filterId));
  }

  unregister () {
    return this._transport
      .execute('eth_unregister');
  }
}
