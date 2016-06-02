'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var EthAbi = _interopDefault(require('ethabi-js'));

var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

/* global fetch */var 
JsonRpc = function () {
  function JsonRpc(host, port) {babelHelpers.classCallCheck(this, JsonRpc);
    this._host = host;
    this._port = port;
    this._id = 1;
    this._debug = false;}babelHelpers.createClass(JsonRpc, [{ key: '_encodeBody', value: function _encodeBody(


    method, params) {
      return JSON.stringify({ 
        jsonrpc: '2.0', 
        method: method, 
        params: params, 
        id: this._id++ });} }, { key: '_encodeOptions', value: function _encodeOptions(



    method, params) {
      var json = this._encodeBody(method, params);

      return { 
        method: 'POST', 
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json', 
          'Content-Length': json.length }, 

        body: json };} }, { key: '_getEndpoint', value: function _getEndpoint() 



    {
      return 'http://' + this._host + ':' + this._port + '/';} }, { key: 'execute', value: function execute(


    method) {var _this = this;for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {params[_key - 1] = arguments[_key];}
      return fetch(this._getEndpoint(), this._encodeOptions(method, params)).
      then(function (response) {
        if (response.status !== 200) {
          if (_this._debug) {
            console.error('   ', method + '(' + params + ') throws', response.status, response.statusText);}


          throw new Error(response.status + ': ' + response.statusText);}


        return response.json();}).

      then(function (result) {
        if (result.error) {
          if (_this._debug) {
            console.error('   ', method + '(' + params + ') =', result);}


          throw new Error(result.error.code + ': ' + result.error.message);}


        if (_this._debug) {
          console.log('   ', method + '(' + params + ') =', result.result);}


        return result.result;});} }, { key: 'setDebug', value: function setDebug(



    flag) {
      this._debug = flag;} }]);return JsonRpc;}();

function isFunction(test) {
  return Object.prototype.toString.call(test) === '[object Function]';}


function isInstanceOf(test, clazz) {
  return test instanceof clazz;}

var 

Contract = function () {
  function Contract(eth, abi) {var _this = this;babelHelpers.classCallCheck(this, Contract);
    if (!isInstanceOf(eth, EthApi)) {
      throw new Error('EthApi needs to be provided to Contract instance');} else 
    if (!abi) {
      throw new Error('Object ABI needs to be provided to Contract instance');}


    this._eth = eth;
    this._abi = new EthAbi(abi);

    this._constructors = this._abi.constructors.map(function (cons) {return _this._bindFunction(cons);});
    this._functions = this._abi.functions.map(function (func) {return _this._bindFunction(func);});
    this._events = this._abi.events;}babelHelpers.createClass(Contract, [{ key: 'at', value: function at(


























    address) {
      this._address = address;
      return this;} }, { key: 'parseTransactionEvents', value: function parseTransactionEvents(


    receipt) {var _this2 = this;
      receipt.logs = receipt.logs.map(function (log) {
        var signature = log.topics[0].substr(2);
        var event = _this2.events.find(function (evt) {return evt.signature === signature;});

        if (!event) {
          throw new Error('Unable to find event matching signature ' + signature);}


        var decoded = event.decodeLog(log.topics, log.data);

        log.params = {};
        log.address = decoded.address;

        decoded.params.forEach(function (param) {
          log.params[param.name] = param.token.value;});


        return log;});


      return receipt;} }, { key: '_encodeOptions', value: function _encodeOptions(


    func, options, values) {
      var tokens = this._abi.encodeTokens(func.inputParamTypes(), values);

      options.to = options.to || this._address;
      options.data = '0x' + func.encodeCall(tokens);

      return options;} }, { key: '_bindFunction', value: function _bindFunction(


    func) {var _this3 = this;
      func.call = function (options, values) {
        return _this3._eth.eth.
        call(_this3._encodeOptions(func, options, values)).
        then(function (encoded) {return func.decodeOutput(encoded);}).
        then(function (tokens) {return tokens.map(function (token) {return token.value;});}).
        then(function (returns) {return returns.length === 1 ? returns[0] : returns;});};


      func.sendTransaction = function (options, values) {
        return _this3._eth.eth.
        sendTransaction(_this3._encodeOptions(func, options, values));};


      func.estimateGas = function (options, values) {
        return _this3._eth.eth.
        estimateGas(_this3._encodeOptions(func, options, values));};


      return func;} }, { key: 'address', get: function get() {return this._address;} }, { key: 'constructors', get: function get() {return this._constructors;} }, { key: 'events', get: function get() {return this._events;} }, { key: 'functions', get: function get() {return this._functions;} }, { key: 'eth', get: function get() {return this._eth;} }, { key: 'abi', get: function get() {return this._abi;} }]);return Contract;}();

var Db = function () {
  function Db(transport) {babelHelpers.classCallCheck(this, Db);
    this._transport = transport;}babelHelpers.createClass(Db, [{ key: 'getHex', value: function getHex(


    dbName, keyName) {
      return this._transport.execute('db_getHex', dbName, keyName);} }, { key: 'getString', value: function getString(


    dbName, keyName) {
      return this._transport.execute('db_getString', dbName, keyName);} }, { key: 'putHex', value: function putHex(


    dbName, keyName, hexData) {
      return this._transport.execute('db_putHex', dbName, keyName, hexData);} }, { key: 'putString', value: function putString(


    dbName, keyName, stringData) {
      return this._transport.execute('db_putString', dbName, keyName, stringData);} }]);return Db;}();

var Eth = function () {
  function Eth(transport) {babelHelpers.classCallCheck(this, Eth);
    this._transport = transport;}babelHelpers.createClass(Eth, [{ key: 'accounts', value: function accounts() 


    {
      return this._transport.execute('eth_accounts');} }, { key: 'blockNumber', value: function blockNumber() 


    {
      return this._transport.execute('eth_blockNumber');} }, { key: 'call', value: function call(


    options) {var blockNumber = arguments.length <= 1 || arguments[1] === undefined ? 'latest' : arguments[1];
      return this._transport.execute('eth_call', options, blockNumber);} }, { key: 'coinbase', value: function coinbase() 


    {
      return this._transport.execute('eth_coinbase');} }, { key: 'compileLLL', value: function compileLLL(


    code) {
      return this._transport.execute('eth_compileLLL', code);} }, { key: 'compileSerpent', value: function compileSerpent(


    code) {
      return this._transport.execute('eth_compileSerpent', code);} }, { key: 'compileSolidity', value: function compileSolidity(


    code) {
      return this._transport.execute('eth_compileSolidity', code);} }, { key: 'estimateGas', value: function estimateGas(


    options) {
      return this._transport.execute('eth_estimateGas', options);} }, { key: 'fetchQueuedTransactions', value: function fetchQueuedTransactions() 


    {
      return this._transport.execute('eth_fetchQueuedTransactions');} }, { key: 'flush', value: function flush() 


    {
      return this._transport.execute('eth_flush');} }, { key: 'gasPrice', value: function gasPrice() 


    {
      return this._transport.execute('eth_gasPrice');} }, { key: 'getBalance', value: function getBalance(


    address) {var blockNumber = arguments.length <= 1 || arguments[1] === undefined ? 'latest' : arguments[1];
      return this._transport.execute('eth_getBalance', address, blockNumber);} }, { key: 'getBlockByHash', value: function getBlockByHash(


    hash) {var full = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      return this._transport.execute('eth_getBlockByHash', hash, full);} }, { key: 'getBlockByNumber', value: function getBlockByNumber() 


    {var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];var full = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      return this._transport.execute('eth_getBlockByNumber', blockNumber, full);} }, { key: 'getBlockTransactionCountByHash', value: function getBlockTransactionCountByHash(


    hash) {
      return this._transport.execute('eth_getBlockTransactionCountByHash', hash);} }, { key: 'getBlockTransactionCountByNumber', value: function getBlockTransactionCountByNumber() 


    {var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];
      return this._transport.execute('eth_getBlockTransactionCountByNumber', blockNumber);} }, { key: 'getCode', value: function getCode(


    address) {var blockNumber = arguments.length <= 1 || arguments[1] === undefined ? 'latest' : arguments[1];
      return this._transport.execute('eth_getCode', address, blockNumber);} }, { key: 'getCompilers', value: function getCompilers() 


    {
      return this._transport.execute('eth_getCompilers');} }, { key: 'getFilterChanges', value: function getFilterChanges(


    filterId) {
      return this._transport.execute('eth_getFilterChanges', filterId);} }, { key: 'getFilterChangesEx', value: function getFilterChangesEx(


    filterId) {
      return this._transport.execute('eth_getFilterChangesEx', filterId);} }, { key: 'getFilterLogs', value: function getFilterLogs(


    filterId) {
      return this._transport.execute('eth_getFilterLogs', filterId);} }, { key: 'getFilterLogsEx', value: function getFilterLogsEx(


    filterId) {
      return this._transport.execute('eth_getFilterLogsEx', filterId);} }, { key: 'getLogs', value: function getLogs(


    options) {
      return this._transport.execute('eth_getLogs', options);} }, { key: 'getLogsEx', value: function getLogsEx(


    options) {
      return this._transport.execute('eth_getLogsEx', options);} }, { key: 'getStorageAt', value: function getStorageAt(


    address) {var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];var blockNumber = arguments.length <= 2 || arguments[2] === undefined ? 'latest' : arguments[2];
      return this._transport.execute('eth_getStorageAt', address, index, blockNumber);} }, { key: 'getTransactionByBlockHashAndIndex', value: function getTransactionByBlockHashAndIndex(


    hash) {var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      return this._transport.execute('eth_getTransactionByBlockHashAndIndex', hash, index);} }, { key: 'getTransactionByBlockNumberAndIndex', value: function getTransactionByBlockNumberAndIndex() 


    {var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      return this._transport.execute('eth_getTransactionByBlockNumberAndIndex', blockNumber, index);} }, { key: 'getTransactionByHash', value: function getTransactionByHash(


    hash) {
      return this._transport.execute('eth_getTransactionByHash', hash);} }, { key: 'getTransactionCount', value: function getTransactionCount(


    address) {var blockNumber = arguments.length <= 1 || arguments[1] === undefined ? 'latest' : arguments[1];
      return this._transport.execute('eth_getTransactionCount', address, blockNumber);} }, { key: 'getTransactionReceipt', value: function getTransactionReceipt(


    txhash) {
      return this._transport.execute('eth_getTransactionReceipt', txhash);} }, { key: 'getUncleByBlockHashAndIndex', value: function getUncleByBlockHashAndIndex(


    hash) {var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      return this._transport.execute('eth_getUncleByBlockHashAndIndex', hash, index);} }, { key: 'getUncleByBlockNumberAndIndex', value: function getUncleByBlockNumberAndIndex() 


    {var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      return this._transport.execute('eth_getUncleByBlockNumberAndIndex', blockNumber, index);} }, { key: 'getUncleCountByBlockHash', value: function getUncleCountByBlockHash(


    hash) {
      return this._transport.execute('eth_getUncleCountByBlockHash', hash);} }, { key: 'getUncleCountByBlockNumber', value: function getUncleCountByBlockNumber() 


    {var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];
      return this._transport.execute('eth_getUncleCountByBlockNumber', blockNumber);} }, { key: 'getWork', value: function getWork() 


    {
      return this._transport.execute('eth_getWork');} }, { key: 'hashrate', value: function hashrate() 


    {
      return this._transport.execute('eth_hashrate');} }, { key: 'inspectTransaction', value: function inspectTransaction() 


    {
      return this._transport.execute('eth_inspectTransaction');} }, { key: 'mining', value: function mining() 


    {
      return this._transport.execute('eth_mining');} }, { key: 'newBlockFilter', value: function newBlockFilter() 


    {
      return this._transport.execute('eth_newBlockFilter');} }, { key: 'newFilter', value: function newFilter(


    options) {
      return this._transport.execute('eth_newFilter', options);} }, { key: 'newFilterEx', value: function newFilterEx(


    options) {
      return this._transport.execute('eth_newFilterEx', options);} }, { key: 'newPendingTransactionFilter', value: function newPendingTransactionFilter() 


    {
      return this._transport.execute('eth_newPendingTransactionFilter');} }, { key: 'notePassword', value: function notePassword() 


    {
      return this._transport.execute('eth_notePassword');} }, { key: 'pendingTransactions', value: function pendingTransactions() 


    {
      return this._transport.execute('eth_pendingTransactions');} }, { key: 'protocolVersion', value: function protocolVersion() 


    {
      return this._transport.execute('eth_protocolVersion');} }, { key: 'register', value: function register() 


    {
      return this._transport.execute('eth_register');} }, { key: 'sendRawTransaction', value: function sendRawTransaction(


    data) {
      return this._transport.execute('eth_sendRawTransaction', data);} }, { key: 'sendTransaction', value: function sendTransaction(


    options) {
      return this._transport.execute('eth_sendTransaction', options);} }, { key: 'sign', value: function sign() 


    {
      return this._transport.execute('eth_sign');} }, { key: 'signTransaction', value: function signTransaction() 


    {
      return this._transport.execute('eth_signTransaction');} }, { key: 'submitHashrate', value: function submitHashrate(


    hashrate, clientId) {
      return this._transport.execute('eth_submitHashrate', hashrate, clientId);} }, { key: 'submitWork', value: function submitWork(


    nonce, powHash, mixDigest) {
      return this._transport.execute('eth_submitWork', nonce, powHash, mixDigest);} }, { key: 'syncing', value: function syncing() 


    {
      return this._transport.execute('eth_syncing');} }, { key: 'uninstallFilter', value: function uninstallFilter(


    filterId) {
      return this._transport.execute('eth_uninstallFilter', filterId);} }, { key: 'unregister', value: function unregister() 


    {
      return this._transport.execute('eth_unregister');} }]);return Eth;}();

var Ethcore = function () {
  function Ethcore(transport) {babelHelpers.classCallCheck(this, Ethcore);
    this._transport = transport;}babelHelpers.createClass(Ethcore, [{ key: 'extraData', value: function extraData() 


    {
      return this._transport.execute('ethcore_extraData');} }, { key: 'gasFloorTarget', value: function gasFloorTarget() 


    {
      return this._transport.execute('ethcore_gasFloorTarget');} }, { key: 'minGasPrice', value: function minGasPrice() 


    {
      return this._transport.execute('ethcore_minGasPrice');} }, { key: 'netChain', value: function netChain() 


    {
      return this._transport.execute('ethcore_netChain');} }, { key: 'netMaxPeers', value: function netMaxPeers() 


    {
      return this._transport.execute('ethcore_netMaxPeers');} }, { key: 'netPort', value: function netPort() 


    {
      return this._transport.execute('ethcore_netPort');} }, { key: 'nodeName', value: function nodeName() 


    {
      return this._transport.execute('ethcore_nodeName');} }, { key: 'setAuthor', value: function setAuthor(


    address) {
      return this._transport.execute('ethcore_setAuthor');} }, { key: 'setExtraData', value: function setExtraData(


    data) {
      return this._transport.execute('ethcore_setExtraData', data);} }, { key: 'setGasFloorTarget', value: function setGasFloorTarget(


    quantity) {
      return this._transport.execute('ethcore_setGasFloorTarget');} }, { key: 'setMinGasPrice', value: function setMinGasPrice(


    quantity) {
      return this._transport.execute('ethcore_setMinGasPrice', quantity);} }, { key: 'setTransactionsLimit', value: function setTransactionsLimit(


    quantity) {
      return this._transport.execute('ethcore_setTransactionsLimit', quantity);} }, { key: 'transactionsLimit', value: function transactionsLimit() 


    {
      return this._transport.execute('ethcore_transactionsLimit');} }, { key: 'rpcSettings', value: function rpcSettings() 


    {
      return this._transport.execute('ethcore_rpcSettings');} }]);return Ethcore;}();

var Net = function () {
  function Net(transport) {babelHelpers.classCallCheck(this, Net);
    this._transport = transport;}babelHelpers.createClass(Net, [{ key: 'listening', value: function listening() 


    {
      return this._transport.execute('net_listening');} }, { key: 'peerCount', value: function peerCount() 


    {
      return this._transport.execute('net_peerCount');} }, { key: 'version', value: function version() 


    {
      return this._transport.execute('net_version');} }]);return Net;}();

var Personal = function () {
  function Personal(transport) {babelHelpers.classCallCheck(this, Personal);
    this._transport = transport;}babelHelpers.createClass(Personal, [{ key: 'listAccounts', value: function listAccounts() 


    {
      return this._transport.execute('personal_listAccounts');} }, { key: 'newAccount', value: function newAccount(


    password) {
      return this._transport.execute('personal_newAccount', password);} }, { key: 'signAndSendTransaction', value: function signAndSendTransaction(


    txObject, password) {
      return this._transport.execute('personal_signAndSendTransaction', txObject, password);} }, { key: 'unlockAccount', value: function unlockAccount(


    account, password) {var duration = arguments.length <= 2 || arguments[2] === undefined ? 5 : arguments[2];
      return this._transport.execute('personal_unlockAccount', account, password, duration);} }]);return Personal;}();

var Personal$1 = function () {
  function Personal(transport) {babelHelpers.classCallCheck(this, Personal);
    this._transport = transport;}babelHelpers.createClass(Personal, [{ key: 'addToGroup', value: function addToGroup(


    identity) {
      return this._transport.execute('shh_addToGroup', identity);} }, { key: 'getFilterChanges', value: function getFilterChanges(


    filterId) {
      return this._transport.execute('shh_getFilterChanges', filterId);} }, { key: 'getMessages', value: function getMessages(


    filterId) {
      return this._transport.execute('shh_getMessages', filterId);} }, { key: 'hasIdentity', value: function hasIdentity(


    identity) {
      return this._transport.execute('shh_hasIdentity', identity);} }, { key: 'newFilter', value: function newFilter(


    options) {
      return this._transport.execute('shh_newFilter', options);} }, { key: 'newGroup', value: function newGroup() 


    {
      return this._transport.execute('shh_newGroup');} }, { key: 'newIdentity', value: function newIdentity() 


    {
      return this._transport.execute('shh_newIdentity');} }, { key: 'post', value: function post(


    options) {
      return this._transport.execute('shh_post', options);} }, { key: 'uninstallFilter', value: function uninstallFilter(


    filterId) {
      return this._transport.execute('shh_uninstallFilter', filterId);} }, { key: 'version', value: function version() 


    {
      return this._transport.execute('shh_version');} }]);return Personal;}();

var Trace = function () {
  function Trace(transport) {babelHelpers.classCallCheck(this, Trace);
    this._transport = transport;}babelHelpers.createClass(Trace, [{ key: 'filter', value: function filter(


    filterObj) {
      return this._transport.execute('trace_filter', filterObj);} }, { key: 'get', value: function get(


    txHash, position) {
      return this._transport.execute('trace_get', txHash, position);} }, { key: 'transaction', value: function transaction(


    txHash) {
      return this._transport.execute('trace_transaction', txHash);} }, { key: 'block', value: function block() 


    {var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];
      return this._transport.execute('trace_block', blockNumber);} }]);return Trace;}();

var Web3 = function () {
  function Web3(transport) {babelHelpers.classCallCheck(this, Web3);
    this._transport = transport;}babelHelpers.createClass(Web3, [{ key: 'clientVersion', value: function clientVersion() 


    {
      return this._transport.execute('web3_clientVersion');} }, { key: 'sha3', value: function sha3(


    hexStr) {
      return this._transport.execute('web3_sha3', hexStr);} }]);return Web3;}();

var 

EthApi = function () {
  function EthApi(transport) {babelHelpers.classCallCheck(this, EthApi);
    if (!transport || !isFunction(transport.execute)) {
      throw new Error('EthApi needs transport with execute() function defined');}


    this._db = new Db(transport);
    this._eth = new Eth(transport);
    this._ethcore = new Ethcore(transport);
    this._net = new Net(transport);
    this._personal = new Personal(transport);
    this._shh = new Personal$1(transport);
    this._trace = new Trace(transport);
    this._web3 = new Web3(transport);}babelHelpers.createClass(EthApi, [{ key: 'db', get: function get() 


    {
      return this._db;} }, { key: 'eth', get: function get() 


    {
      return this._eth;} }, { key: 'ethcore', get: function get() 


    {
      return this._ethcore;} }, { key: 'net', get: function get() 


    {
      return this._net;} }, { key: 'personal', get: function get() 


    {
      return this._personal;} }, { key: 'shh', get: function get() 


    {
      return this._shh;} }, { key: 'trace', get: function get() 


    {
      return this._trace;} }, { key: 'web3', get: function get() 


    {
      return this._web3;} }]);return EthApi;}();EthApi.


Contract = Contract;EthApi.

Transports = { 
  JsonRpc: JsonRpc };

module.exports = EthApi;/* Thu Jun  2 09:55:50 UTC 2016 */
