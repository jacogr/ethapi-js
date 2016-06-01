export default class Eth {
  constructor (transport) {
    this._transport = transport;
  }

  accounts () {
    return this._transport.execute('eth_accounts');
  }

  blockNumber () {
    return this._transport.execute('eth_blockNumber');
  }

  call (options, blockNumber = 'latest') {
    return this._transport.execute('eth_call', options, blockNumber);
  }

  coinbase () {
    return this._transport.execute('eth_coinbase');
  }

  compileLLL (code) {
    return this._transport.execute('eth_compileLLL', code);
  }

  compileSerpent (code) {
    return this._transport.execute('eth_compileSerpent', code);
  }

  compileSolidity (code) {
    return this._transport.execute('eth_compileSolidity', code);
  }

  estimateGas (options) {
    return this._transport.execute('eth_estimateGas', options);
  }

  fetchQueuedTransactions () {
    return this._transport.execute('eth_fetchQueuedTransactions');
  }

  flush () {
    return this._transport.execute('eth_flush');
  }

  gasPrice () {
    return this._transport.execute('eth_gasPrice');
  }

  getBalance (address, blockNumber = 'latest') {
    return this._transport.execute('eth_getBalance', address, blockNumber);
  }

  getBlockByHash (hash, full = false) {
    return this._transport.execute('eth_getBlockByHash', hash, full);
  }

  getBlockByNumber (blockNumber = 'latest', full = false) {
    return this._transport.execute('eth_getBlockByNumber', blockNumber, full);
  }

  getBlockTransactionCountByHash (hash) {
    return this._transport.execute('eth_getBlockTransactionCountByHash', hash);
  }

  getBlockTransactionCountByNumber (blockNumber = 'latest') {
    return this._transport.execute('eth_getBlockTransactionCountByNumber', blockNumber);
  }

  getCode (address, blockNumber = 'latest') {
    return this._transport.execute('eth_getCode', address, blockNumber);
  }

  getCompilers () {
    return this._transport.execute('eth_getCompilers');
  }

  getFilterChanges (filterId) {
    return this._transport.execute('eth_getFilterChanges', filterId);
  }

  getFilterChangesEx (filterId) {
    return this._transport.execute('eth_getFilterChangesEx', filterId);
  }

  getFilterLogs (filterId) {
    return this._transport.execute('eth_getFilterLogs', filterId);
  }

  getFilterLogsEx (filterId) {
    return this._transport.execute('eth_getFilterLogsEx', filterId);
  }

  getLogs (options) {
    return this._transport.execute('eth_getLogs', options);
  }

  getLogsEx (options) {
    return this._transport.execute('eth_getLogsEx', options);
  }

  getStorageAt (address, index = 0, blockNumber = 'latest') {
    return this._transport.execute('eth_getStorageAt', address, index, blockNumber);
  }

  getTransactionByBlockHashAndIndex (hash, index = 0) {
    return this._transport.execute('eth_getTransactionByBlockHashAndIndex', hash, index);
  }

  getTransactionByBlockNumberAndIndex (blockNumber = 'latest', index = 0) {
    return this._transport.execute('eth_getTransactionByBlockNumberAndIndex', blockNumber, index);
  }

  getTransactionByHash (hash) {
    return this._transport.execute('eth_getTransactionByHash', hash);
  }

  getTransactionCount (address, blockNumber = 'latest') {
    return this._transport.execute('eth_getTransactionCount', address, blockNumber);
  }

  getTransactionReceipt (txhash) {
    return this._transport.execute('eth_getTransactionReceipt', txhash);
  }

  getUncleByBlockHashAndIndex (hash, index = 0) {
    return this._transport.execute('eth_getUncleByBlockHashAndIndex', hash, index);
  }

  getUncleByBlockNumberAndIndex (blockNumber = 'latest', index = 0) {
    return this._transport.execute('eth_getUncleByBlockNumberAndIndex', blockNumber, index);
  }

  getUncleCountByBlockHash (hash) {
    return this._transport.execute('eth_getUncleCountByBlockHash', hash);
  }

  getUncleCountByBlockNumber (blockNumber = 'latest') {
    return this._transport.execute('eth_getUncleCountByBlockNumber', blockNumber);
  }

  getWork () {
    return this._transport.execute('eth_getWork');
  }

  hashrate () {
    return this._transport.execute('eth_hashrate');
  }

  inspectTransaction () {
    return this._transport.execute('eth_inspectTransaction');
  }

  mining () {
    return this._transport.execute('eth_mining');
  }

  newBlockFilter () {
    return this._transport.execute('eth_newBlockFilter');
  }

  newFilter (options) {
    return this._transport.execute('eth_newFilter', options);
  }

  newFilterEx (options) {
    return this._transport.execute('eth_newFilterEx', options);
  }

  newPendingTransactionFilter () {
    return this._transport.execute('eth_newPendingTransactionFilter');
  }

  notePassword () {
    return this._transport.execute('eth_notePassword');
  }

  pendingTransactions () {
    return this._transport.execute('eth_pendingTransactions');
  }

  protocolVersion () {
    return this._transport.execute('eth_protocolVersion');
  }

  register () {
    return this._transport.execute('eth_register');
  }

  sendRawTransaction (data) {
    return this._transport.execute('eth_sendRawTransaction', data);
  }

  sendTransaction (options) {
    return this._transport.execute('eth_sendTransaction', options);
  }

  sign () {
    return this._transport.execute('eth_sign');
  }

  signTransaction () {
    return this._transport.execute('eth_signTransaction');
  }

  submitHashrate (hashrate, clientId) {
    return this._transport.execute('eth_submitHashrate', hashrate, clientId);
  }

  submitWork (nonce, powHash, mixDigest) {
    return this._transport.execute('eth_submitWork', nonce, powHash, mixDigest);
  }

  syncing () {
    return this._transport.execute('eth_syncing');
  }

  uninstallFilter (filterId) {
    return this._transport.execute('eth_uninstallFilter', filterId);
  }

  unregister () {
    return this._transport.execute('eth_unregister');
  }
}
