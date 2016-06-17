'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var EthAbi = _interopDefault(require('ethabi-js'));
var BigNumber = _interopDefault(require('bignumber.js'));
var jsSha3 = require('js-sha3');

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
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

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var JsonRpcBase = function () {
  function JsonRpcBase() {
    classCallCheck(this, JsonRpcBase);

    this._id = 1;
    this._debug = false;
  }

  createClass(JsonRpcBase, [{
    key: 'encode',
    value: function encode(method, params) {
      return JSON.stringify({
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: this._id++
      });
    }
  }, {
    key: 'setDebug',
    value: function setDebug(flag) {
      this._debug = flag;
    }
  }, {
    key: 'error',
    value: function error(_error) {
      if (this.isDebug) {
        console.error(_error);
      }
    }
  }, {
    key: 'log',
    value: function log(_log) {
      if (this.isDebug) {
        console.log(_log);
      }
    }
  }, {
    key: 'id',
    get: function get() {
      return this._id;
    }
  }, {
    key: 'isDebug',
    get: function get() {
      return this._debug;
    }
  }]);
  return JsonRpcBase;
}();

/* global fetch */

var Http = function (_JsonRpcBase) {
  inherits(Http, _JsonRpcBase);

  function Http(url) {
    classCallCheck(this, Http);

    var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Http).call(this));

    _this._url = url;
    return _this;
  }

  createClass(Http, [{
    key: '_encodeOptions',
    value: function _encodeOptions(method, params) {
      var json = this.encode(method, params);

      this.log(json);

      return {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': json.length
        },
        body: json
      };
    }
  }, {
    key: 'execute',
    value: function execute(method) {
      var _this2 = this;

      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      return fetch(this._url, this._encodeOptions(method, params)).then(function (response) {
        if (response.status !== 200) {
          _this2.error(JSON.stringify({ status: response.status, statusText: response.statusText }));
          throw new Error(response.status + ': ' + response.statusText);
        }

        return response.json();
      }).then(function (result) {
        if (result.error) {
          _this2.error(JSON.stringify(result));
          throw new Error(result.error.code + ': ' + result.error.message);
        }

        _this2.log(JSON.stringify(result));
        return result.result;
      });
    }
  }]);
  return Http;
}(JsonRpcBase);

/* global WebSocket */

var Ws = function (_JsonRpcBase) {
  inherits(Ws, _JsonRpcBase);

  function Ws(url, protocols) {
    classCallCheck(this, Ws);

    var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Ws).call(this));

    _this._onMessage = function (event) {
      var result = JSON.parse(event.data);
      var _this$_messages$resul = _this._messages[result.id];
      var resolve = _this$_messages$resul.resolve;
      var reject = _this$_messages$resul.reject;


      if (result.error) {
        _this.error(event.data);

        reject(new Error(result.error.code + ': ' + result.error.message));
        delete _this._messages[result.id];
        return;
      }

      _this.log(event.data);

      resolve(result.result);
      delete _this._messages[result.id];
    };

    _this._messages = {};

    _this._ws = new WebSocket(url, protocols);
    _this._ws.onerror = _this._onError;
    _this._ws.onopen = _this._onOpen;
    _this._ws.onclose = _this._onClose;
    _this._ws.onmessage = _this._onMessage;
    return _this;
  }

  createClass(Ws, [{
    key: 'execute',
    value: function execute(method) {
      var _this2 = this;

      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      return new Promise(function (resolve, reject) {
        _this2._messages[_this2.id] = { resolve: resolve, reject: reject };
        var json = _this2.encode(method, params);

        _this2.log(json);

        _this2._ws.send(json);
      });
    }
  }]);
  return Ws;
}(JsonRpcBase);

function isFunction(test) {
  return Object.prototype.toString.call(test) === '[object Function]';
}

function isString(test) {
  return Object.prototype.toString.call(test) === '[object String]';
}

function isInstanceOf(test, clazz) {
  return test instanceof clazz;
}

var Contract = function () {
  function Contract(eth, abi) {
    var _this = this;

    classCallCheck(this, Contract);

    if (!isInstanceOf(eth, EthApi)) {
      throw new Error('EthApi needs to be provided to Contract instance');
    } else if (!abi) {
      throw new Error('Object ABI needs to be provided to Contract instance');
    }

    this._eth = eth;
    this._abi = new EthAbi(abi);

    this._constructors = this._abi.constructors.map(function (cons) {
      return _this._bindFunction(cons);
    });
    this._functions = this._abi.functions.map(function (func) {
      return _this._bindFunction(func);
    });
    this._events = this._abi.events;
  }

  createClass(Contract, [{
    key: 'at',
    value: function at(address) {
      this._address = address;
      return this;
    }
  }, {
    key: 'parseTransactionEvents',
    value: function parseTransactionEvents(receipt) {
      var _this2 = this;

      receipt.logs = receipt.logs.map(function (log) {
        var signature = log.topics[0].substr(2);
        var event = _this2.events.find(function (evt) {
          return evt.signature === signature;
        });

        if (!event) {
          throw new Error('Unable to find event matching signature ' + signature);
        }

        var decoded = event.decodeLog(log.topics, log.data);

        log.params = {};
        log.address = decoded.address;

        decoded.params.forEach(function (param) {
          log.params[param.name] = param.token.value;
        });

        return log;
      });

      return receipt;
    }
  }, {
    key: '_encodeOptions',
    value: function _encodeOptions(func, options, values) {
      var tokens = this._abi.encodeTokens(func.inputParamTypes(), values);

      options.to = options.to || this._address;
      options.data = '0x' + func.encodeCall(tokens);

      return options;
    }
  }, {
    key: '_bindFunction',
    value: function _bindFunction(func) {
      var _this3 = this;

      func.call = function (options, values) {
        return _this3._eth.eth.call(_this3._encodeOptions(func, options, values)).then(function (encoded) {
          return func.decodeOutput(encoded);
        }).then(function (tokens) {
          return tokens.map(function (token) {
            return token.value;
          });
        }).then(function (returns) {
          return returns.length === 1 ? returns[0] : returns;
        });
      };

      if (!func.constant) {
        func.sendTransaction = function (options, values) {
          return _this3._eth.eth.sendTransaction(_this3._encodeOptions(func, options, values));
        };

        func.signAndSendTransaction = function (options, values, password) {
          return _this3._eth.personal.signAndSendTransaction(_this3._encodeOptions(func, options, values), password);
        };

        func.estimateGas = function (options, values) {
          return _this3._eth.eth.estimateGas(_this3._encodeOptions(func, options, values));
        };
      }

      return func;
    }
  }, {
    key: 'address',
    get: function get() {
      return this._address;
    }
  }, {
    key: 'constructors',
    get: function get() {
      return this._constructors;
    }
  }, {
    key: 'events',
    get: function get() {
      return this._events;
    }
  }, {
    key: 'functions',
    get: function get() {
      return this._functions;
    }
  }, {
    key: 'eth',
    get: function get() {
      return this._eth;
    }
  }, {
    key: 'abi',
    get: function get() {
      return this._abi;
    }
  }]);
  return Contract;
}();

function inAddress(address) {
  // TODO: address validation if we have upper-lower addresses
  return inHex(address);
}

function inBlockNumber(blockNumber) {
  if (isString(blockNumber)) {
    switch (blockNumber) {
      case 'earliest':
      case 'latest':
      case 'pending':
        return blockNumber;
    }
  }

  return inNumber16(blockNumber);
}

function inData(data) {
  return inHex(data);
}

function inFilter(options) {
  if (options) {
    Object.keys(options).forEach(function (key) {
      switch (key) {
        case 'address':
          options[key] = inAddress(options[key]);
          break;

        case 'fromBlock':
        case 'toBlock':
          options[key] = inBlockNumber(options[key]);
          break;
      }
    });
  }

  return options;
}

function inHex(str) {
  if (str && str.substr(0, 2) === '0x') {
    return str.toLowerCase();
  }

  return '0x' + (str || '').toLowerCase();
}

function inNumber10(number) {
  if (isInstanceOf(number, BigNumber)) {
    return number.toNumber();
  }

  return new BigNumber(number || 0).toNumber();
}

function inNumber16(number) {
  if (isInstanceOf(number, BigNumber)) {
    return inHex(number.toString(16));
  }

  return inHex(new BigNumber(number || 0).toString(16));
}

function inOptions(options) {
  if (options) {
    Object.keys(options).forEach(function (key) {
      switch (key) {
        case 'from':
        case 'to':
          options[key] = inAddress(options[key]);
          break;

        case 'gas':
        case 'gasPrice':
        case 'value':
        case 'nonce':
          options[key] = inNumber16(options[key]);
          break;

        case 'data':
          options[key] = inData(options[key]);
          break;
      }
    });
  }

  return options;
}

var Db = function () {
  function Db(transport) {
    classCallCheck(this, Db);

    this._transport = transport;
  }

  createClass(Db, [{
    key: 'getHex',
    value: function getHex(dbName, keyName) {
      return this._transport.execute('db_getHex', dbName, keyName);
    }
  }, {
    key: 'getString',
    value: function getString(dbName, keyName) {
      return this._transport.execute('db_getString', dbName, keyName);
    }
  }, {
    key: 'putHex',
    value: function putHex(dbName, keyName, hexData) {
      return this._transport.execute('db_putHex', dbName, keyName, inHex(hexData));
    }
  }, {
    key: 'putString',
    value: function putString(dbName, keyName, stringData) {
      return this._transport.execute('db_putString', dbName, keyName, stringData);
    }
  }]);
  return Db;
}();

// eslint-disable-line camelcase

function isChecksumValid(_address) {
  var address = _address.replace('0x', '');
  var hash = jsSha3.keccak_256(address.toLowerCase(address));

  for (var n = 0; n < 40; n++) {
    var hashval = parseInt(hash[n], 16);
    var isLower = address[n].toUpperCase() !== address[n];
    var isUpper = address[n].toLowerCase() !== address[n];

    if (hashval > 7 && isLower || hashval <= 7 && isUpper) {
      return false;
    }
  }

  return true;
}

function isAddress(address) {
  if (address && address.length === 42) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
      return true;
    }

    return isChecksumValid(address);
  }

  return false;
}

function toChecksumAddress(_address) {
  var address = (_address || '').toLowerCase();

  if (!isAddress(address)) {
    return '';
  }

  var hash = jsSha3.keccak_256(address.slice(-40));
  var result = '0x';

  for (var n = 0; n < 40; n++) {
    result = '' + result + (parseInt(hash[n], 16) > 7 ? address[n + 2].toUpperCase() : address[n + 2]);
  }

  return result;
}

function outAddress(address) {
  return toChecksumAddress(address);
}

function outBlock(block) {
  if (block) {
    Object.keys(block).forEach(function (key) {
      switch (key) {
        case 'author':
        case 'miner':
          block[key] = outAddress(block[key]);
          break;

        case 'difficulty':
        case 'gasLimit':
        case 'gasUsed':
        case 'nonce':
        case 'number':
        case 'totalDifficulty':
          block[key] = outNumber(block[key]);
          break;

        case 'timestamp':
          block[key] = outDate(block[key]);
          break;
      }
    });
  }

  return block;
}

function outDate(date) {
  return new Date(outNumber(date).toNumber() * 1000);
}

function outNumber(number) {
  return new BigNumber(number || 0);
}

function outReceipt(receipt) {
  if (receipt) {
    Object.keys(receipt).forEach(function (key) {
      switch (key) {
        case 'blockNumber':
        case 'cumulativeGasUsed':
        case 'gasUsed':
        case 'transactionIndex':
          receipt[key] = outNumber(receipt[key]);
          break;

        case 'contractAddress':
          receipt[key] = outAddress(receipt[key]);
          break;
      }
    });
  }

  return receipt;
}

function outTransaction(tx) {
  if (tx) {
    Object.keys(tx).forEach(function (key) {
      switch (key) {
        case 'blockNumber':
        case 'gasPrice':
        case 'gas':
        case 'nonce':
        case 'transactionIndex':
        case 'value':
          tx[key] = outNumber(tx[key]);
          break;

        case 'from':
        case 'to':
          tx[key] = outAddress(tx[key]);
          break;
      }
    });
  }

  return tx;
}

var Eth = function () {
  function Eth(transport) {
    classCallCheck(this, Eth);

    this._transport = transport;
  }

  createClass(Eth, [{
    key: 'accounts',
    value: function accounts() {
      return this._transport.execute('eth_accounts').then(function (accounts) {
        return (accounts || []).map(outAddress);
      });
    }
  }, {
    key: 'blockNumber',
    value: function blockNumber() {
      return this._transport.execute('eth_blockNumber').then(outNumber);
    }
  }, {
    key: 'call',
    value: function call(options) {
      var blockNumber = arguments.length <= 1 || arguments[1] === undefined ? 'latest' : arguments[1];

      return this._transport.execute('eth_call', inOptions(options), inBlockNumber(blockNumber));
    }
  }, {
    key: 'coinbase',
    value: function coinbase() {
      return this._transport.execute('eth_coinbase').then(outAddress);
    }
  }, {
    key: 'compileLLL',
    value: function compileLLL(code) {
      return this._transport.execute('eth_compileLLL', inData(code));
    }
  }, {
    key: 'compileSerpent',
    value: function compileSerpent(code) {
      return this._transport.execute('eth_compileSerpent', inData(code));
    }
  }, {
    key: 'compileSolidity',
    value: function compileSolidity(code) {
      return this._transport.execute('eth_compileSolidity', inData(code));
    }
  }, {
    key: 'estimateGas',
    value: function estimateGas(options) {
      return this._transport.execute('eth_estimateGas', inOptions(options)).then(outNumber);
    }
  }, {
    key: 'fetchQueuedTransactions',
    value: function fetchQueuedTransactions() {
      return this._transport.execute('eth_fetchQueuedTransactions');
    }
  }, {
    key: 'flush',
    value: function flush() {
      return this._transport.execute('eth_flush');
    }
  }, {
    key: 'gasPrice',
    value: function gasPrice() {
      return this._transport.execute('eth_gasPrice').then(outNumber);
    }
  }, {
    key: 'getBalance',
    value: function getBalance(address) {
      var blockNumber = arguments.length <= 1 || arguments[1] === undefined ? 'latest' : arguments[1];

      return this._transport.execute('eth_getBalance', inAddress(address), inBlockNumber(blockNumber)).then(outNumber);
    }
  }, {
    key: 'getBlockByHash',
    value: function getBlockByHash(hash) {
      var full = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      return this._transport.execute('eth_getBlockByHash', inHex(hash), full).then(outBlock);
    }
  }, {
    key: 'getBlockByNumber',
    value: function getBlockByNumber() {
      var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];
      var full = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      return this._transport.execute('eth_getBlockByNumber', inBlockNumber(blockNumber), full).then(outBlock);
    }
  }, {
    key: 'getBlockTransactionCountByHash',
    value: function getBlockTransactionCountByHash(hash) {
      return this._transport.execute('eth_getBlockTransactionCountByHash', inHex(hash)).then(outNumber);
    }
  }, {
    key: 'getBlockTransactionCountByNumber',
    value: function getBlockTransactionCountByNumber() {
      var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];

      return this._transport.execute('eth_getBlockTransactionCountByNumber', inBlockNumber(blockNumber)).then(outNumber);
    }
  }, {
    key: 'getCode',
    value: function getCode(address) {
      var blockNumber = arguments.length <= 1 || arguments[1] === undefined ? 'latest' : arguments[1];

      return this._transport.execute('eth_getCode', inAddress(address), inBlockNumber(blockNumber));
    }
  }, {
    key: 'getCompilers',
    value: function getCompilers() {
      return this._transport.execute('eth_getCompilers');
    }
  }, {
    key: 'getFilterChanges',
    value: function getFilterChanges(filterId) {
      return this._transport.execute('eth_getFilterChanges', inNumber16(filterId));
    }
  }, {
    key: 'getFilterChangesEx',
    value: function getFilterChangesEx(filterId) {
      return this._transport.execute('eth_getFilterChangesEx', inNumber16(filterId));
    }
  }, {
    key: 'getFilterLogs',
    value: function getFilterLogs(filterId) {
      return this._transport.execute('eth_getFilterLogs', inNumber16(filterId));
    }
  }, {
    key: 'getFilterLogsEx',
    value: function getFilterLogsEx(filterId) {
      return this._transport.execute('eth_getFilterLogsEx', inNumber16(filterId));
    }
  }, {
    key: 'getLogs',
    value: function getLogs(options) {
      return this._transport.execute('eth_getLogs', inFilter(options));
    }
  }, {
    key: 'getLogsEx',
    value: function getLogsEx(options) {
      return this._transport.execute('eth_getLogsEx', inFilter(options));
    }
  }, {
    key: 'getStorageAt',
    value: function getStorageAt(address) {
      var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var blockNumber = arguments.length <= 2 || arguments[2] === undefined ? 'latest' : arguments[2];

      return this._transport.execute('eth_getStorageAt', inAddress(address), inNumber16(index), inBlockNumber(blockNumber));
    }
  }, {
    key: 'getTransactionByBlockHashAndIndex',
    value: function getTransactionByBlockHashAndIndex(hash) {
      var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      return this._transport.execute('eth_getTransactionByBlockHashAndIndex', inHex(hash), inNumber16(index)).then(outTransaction);
    }
  }, {
    key: 'getTransactionByBlockNumberAndIndex',
    value: function getTransactionByBlockNumberAndIndex() {
      var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];
      var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      return this._transport.execute('eth_getTransactionByBlockNumberAndIndex', inBlockNumber(blockNumber), inNumber16(index)).then(outTransaction);
    }
  }, {
    key: 'getTransactionByHash',
    value: function getTransactionByHash(hash) {
      return this._transport.execute('eth_getTransactionByHash', inHex(hash)).then(outTransaction);
    }
  }, {
    key: 'getTransactionCount',
    value: function getTransactionCount(address) {
      var blockNumber = arguments.length <= 1 || arguments[1] === undefined ? 'latest' : arguments[1];

      return this._transport.execute('eth_getTransactionCount', inAddress(address), inBlockNumber(blockNumber)).then(outNumber);
    }
  }, {
    key: 'getTransactionReceipt',
    value: function getTransactionReceipt(txhash) {
      return this._transport.execute('eth_getTransactionReceipt', inHex(txhash)).then(outReceipt);
    }
  }, {
    key: 'getUncleByBlockHashAndIndex',
    value: function getUncleByBlockHashAndIndex(hash) {
      var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      return this._transport.execute('eth_getUncleByBlockHashAndIndex', inHex(hash), inNumber16(index));
    }
  }, {
    key: 'getUncleByBlockNumberAndIndex',
    value: function getUncleByBlockNumberAndIndex() {
      var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];
      var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      return this._transport.execute('eth_getUncleByBlockNumberAndIndex', inBlockNumber(blockNumber), inNumber16(index));
    }
  }, {
    key: 'getUncleCountByBlockHash',
    value: function getUncleCountByBlockHash(hash) {
      return this._transport.execute('eth_getUncleCountByBlockHash', inHex(hash)).then(outNumber);
    }
  }, {
    key: 'getUncleCountByBlockNumber',
    value: function getUncleCountByBlockNumber() {
      var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];

      return this._transport.execute('eth_getUncleCountByBlockNumber', inBlockNumber(blockNumber)).then(outNumber);
    }
  }, {
    key: 'getWork',
    value: function getWork() {
      return this._transport.execute('eth_getWork');
    }
  }, {
    key: 'hashrate',
    value: function hashrate() {
      return this._transport.execute('eth_hashrate').then(outNumber);
    }
  }, {
    key: 'inspectTransaction',
    value: function inspectTransaction() {
      return this._transport.execute('eth_inspectTransaction');
    }
  }, {
    key: 'mining',
    value: function mining() {
      return this._transport.execute('eth_mining');
    }
  }, {
    key: 'newBlockFilter',
    value: function newBlockFilter() {
      return this._transport.execute('eth_newBlockFilter');
    }
  }, {
    key: 'newFilter',
    value: function newFilter(options) {
      return this._transport.execute('eth_newFilter', inFilter(options));
    }
  }, {
    key: 'newFilterEx',
    value: function newFilterEx(options) {
      return this._transport.execute('eth_newFilterEx', inFilter(options));
    }
  }, {
    key: 'newPendingTransactionFilter',
    value: function newPendingTransactionFilter() {
      return this._transport.execute('eth_newPendingTransactionFilter');
    }
  }, {
    key: 'notePassword',
    value: function notePassword() {
      return this._transport.execute('eth_notePassword');
    }
  }, {
    key: 'pendingTransactions',
    value: function pendingTransactions() {
      return this._transport.execute('eth_pendingTransactions');
    }
  }, {
    key: 'protocolVersion',
    value: function protocolVersion() {
      return this._transport.execute('eth_protocolVersion');
    }
  }, {
    key: 'register',
    value: function register() {
      return this._transport.execute('eth_register');
    }
  }, {
    key: 'sendRawTransaction',
    value: function sendRawTransaction(data) {
      return this._transport.execute('eth_sendRawTransaction', inData(data));
    }
  }, {
    key: 'sendTransaction',
    value: function sendTransaction(options) {
      return this._transport.execute('eth_sendTransaction', inOptions(options));
    }
  }, {
    key: 'sign',
    value: function sign() {
      return this._transport.execute('eth_sign');
    }
  }, {
    key: 'signTransaction',
    value: function signTransaction() {
      return this._transport.execute('eth_signTransaction');
    }
  }, {
    key: 'submitHashrate',
    value: function submitHashrate(hashrate, clientId) {
      return this._transport.execute('eth_submitHashrate', inNumber16(hashrate), clientId);
    }
  }, {
    key: 'submitWork',
    value: function submitWork(nonce, powHash, mixDigest) {
      return this._transport.execute('eth_submitWork', inNumber16(nonce), powHash, mixDigest);
    }
  }, {
    key: 'syncing',
    value: function syncing() {
      return this._transport.execute('eth_syncing');
    }
  }, {
    key: 'uninstallFilter',
    value: function uninstallFilter(filterId) {
      return this._transport.execute('eth_uninstallFilter', inHex(filterId));
    }
  }, {
    key: 'unregister',
    value: function unregister() {
      return this._transport.execute('eth_unregister');
    }
  }]);
  return Eth;
}();

var Ethcore = function () {
  function Ethcore(transport) {
    classCallCheck(this, Ethcore);

    this._transport = transport;
  }

  createClass(Ethcore, [{
    key: 'defaultExtraData',
    value: function defaultExtraData() {
      return this._transport.execute('ethcore_defaultExtraData');
    }
  }, {
    key: 'devLogs',
    value: function devLogs() {
      return this._transport.execute('ethcore_devLogs');
    }
  }, {
    key: 'devLogsLevels',
    value: function devLogsLevels() {
      return this._transport.execute('ethcore_devLogsLevels');
    }
  }, {
    key: 'extraData',
    value: function extraData() {
      return this._transport.execute('ethcore_extraData');
    }
  }, {
    key: 'gasFloorTarget',
    value: function gasFloorTarget() {
      return this._transport.execute('ethcore_gasFloorTarget').then(outNumber);
    }
  }, {
    key: 'minGasPrice',
    value: function minGasPrice() {
      return this._transport.execute('ethcore_minGasPrice').then(outNumber);
    }
  }, {
    key: 'netChain',
    value: function netChain() {
      return this._transport.execute('ethcore_netChain');
    }
  }, {
    key: 'netMaxPeers',
    value: function netMaxPeers() {
      return this._transport.execute('ethcore_netMaxPeers').then(outNumber);
    }
  }, {
    key: 'netPort',
    value: function netPort() {
      return this._transport.execute('ethcore_netPort').then(outNumber);
    }
  }, {
    key: 'nodeName',
    value: function nodeName() {
      return this._transport.execute('ethcore_nodeName');
    }
  }, {
    key: 'setAuthor',
    value: function setAuthor(address) {
      return this._transport.execute('ethcore_setAuthor', inAddress(address));
    }
  }, {
    key: 'setExtraData',
    value: function setExtraData(data) {
      return this._transport.execute('ethcore_setExtraData', inData(data));
    }
  }, {
    key: 'setGasFloorTarget',
    value: function setGasFloorTarget(quantity) {
      return this._transport.execute('ethcore_setGasFloorTarget', inNumber16(quantity));
    }
  }, {
    key: 'setMinGasPrice',
    value: function setMinGasPrice(quantity) {
      return this._transport.execute('ethcore_setMinGasPrice', inNumber16(quantity));
    }
  }, {
    key: 'setTransactionsLimit',
    value: function setTransactionsLimit(quantity) {
      return this._transport.execute('ethcore_setTransactionsLimit', inNumber16(quantity));
    }
  }, {
    key: 'transactionsLimit',
    value: function transactionsLimit() {
      return this._transport.execute('ethcore_transactionsLimit').then(outNumber);
    }
  }, {
    key: 'rpcSettings',
    value: function rpcSettings() {
      return this._transport.execute('ethcore_rpcSettings');
    }
  }]);
  return Ethcore;
}();

var Net = function () {
  function Net(transport) {
    classCallCheck(this, Net);

    this._transport = transport;
  }

  createClass(Net, [{
    key: 'listening',
    value: function listening() {
      return this._transport.execute('net_listening');
    }
  }, {
    key: 'peerCount',
    value: function peerCount() {
      return this._transport.execute('net_peerCount').then(outNumber);
    }
  }, {
    key: 'version',
    value: function version() {
      return this._transport.execute('net_version');
    }
  }]);
  return Net;
}();

var Personal = function () {
  function Personal(transport) {
    classCallCheck(this, Personal);

    this._transport = transport;
  }

  createClass(Personal, [{
    key: 'listAccounts',
    value: function listAccounts() {
      return this._transport.execute('personal_listAccounts').then(function (accounts) {
        return (accounts || []).map(outAddress);
      });
    }
  }, {
    key: 'newAccount',
    value: function newAccount(password) {
      return this._transport.execute('personal_newAccount', password).then(outAddress);
    }
  }, {
    key: 'signAndSendTransaction',
    value: function signAndSendTransaction(options, password) {
      return this._transport.execute('personal_signAndSendTransaction', inOptions(options), password);
    }
  }, {
    key: 'unlockAccount',
    value: function unlockAccount(account, password) {
      var duration = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

      return this._transport.execute('personal_unlockAccount', inAddress(account), password, inNumber10(duration));
    }
  }]);
  return Personal;
}();

var Personal$1 = function () {
  function Personal(transport) {
    classCallCheck(this, Personal);

    this._transport = transport;
  }

  createClass(Personal, [{
    key: 'addToGroup',
    value: function addToGroup(identity) {
      return this._transport.execute('shh_addToGroup', identity);
    }
  }, {
    key: 'getFilterChanges',
    value: function getFilterChanges(filterId) {
      return this._transport.execute('shh_getFilterChanges', filterId);
    }
  }, {
    key: 'getMessages',
    value: function getMessages(filterId) {
      return this._transport.execute('shh_getMessages', filterId);
    }
  }, {
    key: 'hasIdentity',
    value: function hasIdentity(identity) {
      return this._transport.execute('shh_hasIdentity', identity);
    }
  }, {
    key: 'newFilter',
    value: function newFilter(options) {
      return this._transport.execute('shh_newFilter', options);
    }
  }, {
    key: 'newGroup',
    value: function newGroup() {
      return this._transport.execute('shh_newGroup');
    }
  }, {
    key: 'newIdentity',
    value: function newIdentity() {
      return this._transport.execute('shh_newIdentity');
    }
  }, {
    key: 'post',
    value: function post(options) {
      return this._transport.execute('shh_post', options);
    }
  }, {
    key: 'uninstallFilter',
    value: function uninstallFilter(filterId) {
      return this._transport.execute('shh_uninstallFilter', filterId);
    }
  }, {
    key: 'version',
    value: function version() {
      return this._transport.execute('shh_version');
    }
  }]);
  return Personal;
}();

var Trace = function () {
  function Trace(transport) {
    classCallCheck(this, Trace);

    this._transport = transport;
  }

  createClass(Trace, [{
    key: 'filter',
    value: function filter(filterObj) {
      return this._transport.execute('trace_filter', filterObj);
    }
  }, {
    key: 'get',
    value: function get(txHash, position) {
      return this._transport.execute('trace_get', inHex(txHash), inNumber16(position));
    }
  }, {
    key: 'transaction',
    value: function transaction(txHash) {
      return this._transport.execute('trace_transaction', inHex(txHash));
    }
  }, {
    key: 'block',
    value: function block() {
      var blockNumber = arguments.length <= 0 || arguments[0] === undefined ? 'latest' : arguments[0];

      return this._transport.execute('trace_block', inBlockNumber(blockNumber));
    }
  }]);
  return Trace;
}();

var Web3 = function () {
  function Web3(transport) {
    classCallCheck(this, Web3);

    this._transport = transport;
  }

  createClass(Web3, [{
    key: 'clientVersion',
    value: function clientVersion() {
      return this._transport.execute('web3_clientVersion');
    }
  }, {
    key: 'sha3',
    value: function sha3(hexStr) {
      return this._transport.execute('web3_sha3', inHex(hexStr));
    }
  }]);
  return Web3;
}();

var EthApi = function () {
  function EthApi(transport) {
    classCallCheck(this, EthApi);

    if (!transport || !isFunction(transport.execute)) {
      throw new Error('EthApi needs transport with execute() function defined');
    }

    this._db = new Db(transport);
    this._eth = new Eth(transport);
    this._ethcore = new Ethcore(transport);
    this._net = new Net(transport);
    this._personal = new Personal(transport);
    this._shh = new Personal$1(transport);
    this._trace = new Trace(transport);
    this._web3 = new Web3(transport);
  }

  createClass(EthApi, [{
    key: 'db',
    get: function get() {
      return this._db;
    }
  }, {
    key: 'eth',
    get: function get() {
      return this._eth;
    }
  }, {
    key: 'ethcore',
    get: function get() {
      return this._ethcore;
    }
  }, {
    key: 'net',
    get: function get() {
      return this._net;
    }
  }, {
    key: 'personal',
    get: function get() {
      return this._personal;
    }
  }, {
    key: 'shh',
    get: function get() {
      return this._shh;
    }
  }, {
    key: 'trace',
    get: function get() {
      return this._trace;
    }
  }, {
    key: 'web3',
    get: function get() {
      return this._web3;
    }
  }]);
  return EthApi;
}();

EthApi.Contract = Contract;
EthApi.Transport = {
  Http: Http,
  Ws: Ws
};

module.exports = EthApi;/* Fri Jun 17 08:09:13 UTC 2016 */
