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

  call (options, blockNumber) {
    return this._transport.execute('eth_call', options, blockNumber || 'latest');
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

  gasPrice () {
    return this._transport.execute('eth_gasPrice');
  }

  getBalance (address, blockNumber) {
    return this._transport.execute('eth_getBalance', address, blockNumber || 'latest');
  }

  getBlockByHash (hash, full) {
    return this._transport.execute('eth_getBlockByHash', hash, !!full);
  }

  getBlockByNumber (blockNumber, full) {
    return this._transport.execute('eth_getBlockByNumber', blockNumber || 'latest', !!full);
  }

  getBlockTransactionCountByHash (hash) {
    return this._transport.execute('eth_getBlockTransactionCountByHash', hash);
  }

  getBlockTransactionCountByNumber (blockNumber) {
    return this._transport.execute('eth_getBlockTransactionCountByNumber', blockNumber || 'latest');
  }

  getCode (address, blockNumber) {
    return this._transport.execute('eth_getCode', address, blockNumber || 'latest');
  }

  getCompilers () {
    return this._transport.execute('eth_getCompilers');
  }

  getFilterChanges (filterId) {
    return this._transport.execute('eth_getFilterChanges', filterId);
  }

  getFilterLogs (filterId) {
    return this._transport.execute('eth_getFilterLogs', filterId);
  }

  getLogs (options) {
    return this._transport.execute('eth_getLogs', options);
  }

  getStorageAt (address, index, blockNumber) {
    return this._transport.execute('eth_getStorageAt', address, index || 0, blockNumber || 'latest');
  }

  getTransactionByBlockHashAndIndex (hash, index) {
    return this._transport.execute('eth_getTransactionByBlockHashAndIndex', hash, index || 0);
  }

  getTransactionByBlockNumberAndIndex (blockNumber, index) {
    return this._transport.execute('eth_getTransactionByBlockNumberAndIndex', blockNumber || 'latest', index || 0);
  }

  getTransactionByHash (hash) {
    return this._transport.execute('eth_getTransactionByHash', hash);
  }

  getTransactionCount (address, blockNumber) {
    return this._transport.execute('eth_getTransactionCount', address, blockNumber || 'latest');
  }

  getTransactionReceipt (txhash) {
    return this._transport.execute('eth_getTransactionReceipt', txhash);
  }

  getUncleByBlockHashAndIndex (hash, index) {
    return this._transport.execute('eth_getUncleByBlockHashAndIndex', hash, index || 0);
  }

  getUncleByBlockNumberAndIndex (blockNumber, index) {
    return this._transport.execute('eth_getUncleByBlockNumberAndIndex', blockNumber || 'latest', index || 0);
  }

  getUncleCountByBlockHash (hash) {
    return this._transport.execute('eth_getUncleCountByBlockHash', hash);
  }

  getUncleCountByBlockNumber (blockNumber) {
    return this._transport.execute('eth_getUncleCountByBlockNumber', blockNumber || 'latest');
  }

  getWork () {
    return this._transport.execute('eth_getWork');
  }

  hashrate () {
    return this._transport.execute('eth_hashrate');
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

  newPendingTransactionFilter () {
    return this._transport.execute('eth_newPendingTransactionFilter');
  }

  protocolVersion () {
    return this._transport.execute('eth_protocolVersion');
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
}
