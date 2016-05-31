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
    this._id = 1;}babelHelpers.createClass(JsonRpc, [{ key: '_encodeBody', value: function _encodeBody(


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


    method) {for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {params[_key - 1] = arguments[_key];}
      return fetch(this._getEndpoint(), this._encodeOptions(method, params)).
      then(function (response) {
        if (response.status !== 200) {
          throw new Error(response.statusText);}


        return response.json();}).

      then(function (result) {
        if (result.error) {
          throw new Error(result.error);}


        return result.result;});} }]);return JsonRpc;}();

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
    this._events = this._abi.events.map(function (event) {return _this._bindEvent(event);});}babelHelpers.createClass(Contract, [{ key: 'at', value: function at(


























    address) {
      this._address = address;
      return this;} }, { key: '_encodeOptions', value: function _encodeOptions(


    func, options, values) {
      var tokens = this._abi.encodeTokens(func.inputParamTypes(), values);

      options.to = options.to || this._address;
      options.data = '0x' + func.encodeCall(tokens);

      return options;} }, { key: '_bindEvent', value: function _bindEvent(


    event) {
      return event;} }, { key: '_bindFunction', value: function _bindFunction(


    func) {var _this2 = this;
      func.call = function (options, values) {
        return _this2._eth.eth.
        call(_this2._encodeOptions(func, options, values)).
        then(function (encoded) {return func.decodeOutput(encoded);});};


      func.sendTransaction = function (options, values) {
        return _this2._eth.eth.
        sendTransaction(_this2._encodeOptions(func, options, values));};


      func.estimateGas = function (options, values) {
        return _this2._eth.eth.
        estimateGas(_this2._encodeOptions(func, options, values));};


      return func;} }, { key: 'address', get: function get() {return this._address;} }, { key: 'constructors', get: function get() {return this._constructors;} }, { key: 'events', get: function get() {return this._events;} }, { key: 'functions', get: function get() {return this._functions;} }, { key: 'eth', get: function get() {return this._eth;} }, { key: 'abi', get: function get() {return this._abi;} }]);return Contract;}();

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
      return this._transport.execute('eth_estimateGas', options);} }, { key: 'gasPrice', value: function gasPrice() 


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
      return this._transport.execute('eth_getFilterChanges', filterId);} }, { key: 'getFilterLogs', value: function getFilterLogs(


    filterId) {
      return this._transport.execute('eth_getFilterLogs', filterId);} }, { key: 'getLogs', value: function getLogs(


    options) {
      return this._transport.execute('eth_getLogs', options);} }, { key: 'getStorageAt', value: function getStorageAt(


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
      return this._transport.execute('eth_hashrate');} }, { key: 'mining', value: function mining() 


    {
      return this._transport.execute('eth_mining');} }, { key: 'newBlockFilter', value: function newBlockFilter() 


    {
      return this._transport.execute('eth_newBlockFilter');} }, { key: 'newFilter', value: function newFilter(


    options) {
      return this._transport.execute('eth_newFilter', options);} }, { key: 'newPendingTransactionFilter', value: function newPendingTransactionFilter() 


    {
      return this._transport.execute('eth_newPendingTransactionFilter');} }, { key: 'protocolVersion', value: function protocolVersion() 


    {
      return this._transport.execute('eth_protocolVersion');} }, { key: 'sendRawTransaction', value: function sendRawTransaction(


    data) {
      return this._transport.execute('eth_sendRawTransaction', data);} }, { key: 'sendTransaction', value: function sendTransaction(


    options) {
      return this._transport.execute('eth_sendTransaction', options);} }, { key: 'sign', value: function sign() 


    {
      return this._transport.execute('eth_sign');} }, { key: 'submitHashrate', value: function submitHashrate(


    hashrate, clientId) {
      return this._transport.execute('eth_submitHashrate', hashrate, clientId);} }, { key: 'submitWork', value: function submitWork(


    nonce, powHash, mixDigest) {
      return this._transport.execute('eth_submitWork', nonce, powHash, mixDigest);} }, { key: 'syncing', value: function syncing() 


    {
      return this._transport.execute('eth_syncing');} }, { key: 'uninstallFilter', value: function uninstallFilter(


    filterId) {
      return this._transport.execute('eth_uninstallFilter', filterId);} }]);return Eth;}();

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
      return this._transport.execute('personal_newAccount', password);} }, { key: 'unlockAccount', value: function unlockAccount(


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
      throw new Error('EthAbi needs transport with execute() function defined');}


    this._eth = new Eth(transport);
    this._net = new Net(transport);
    this._personal = new Personal(transport);
    this._shh = new Personal$1(transport);
    this._web3 = new Web3(transport);}babelHelpers.createClass(EthApi, [{ key: 'eth', get: function get() 


    {
      return this._eth;} }, { key: 'net', get: function get() 


    {
      return this._net;} }, { key: 'personal', get: function get() 


    {
      return this._personal;} }, { key: 'shh', get: function get() 


    {
      return this._shh;} }, { key: 'web3', get: function get() 


    {
      return this._web3;} }]);return EthApi;}();EthApi.


Contract = Contract;EthApi.

Transports = { 
  JsonRpc: JsonRpc };

module.exports = EthApi;/* Tue May 31 16:45:43 UTC 2016 */
