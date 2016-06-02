# ethapi-js

A thin, fast, low-level Promise-based wrapper around the Ethereum APIs.

[![Build Status](https://travis-ci.org/jacogr/ethapi-js.svg?branch=master)](https://travis-ci.org/jacogr/ethapi-js)
[![Coverage Status](https://coveralls.io/repos/github/jacogr/ethapi-js/badge.svg?branch=master)](https://coveralls.io/github/jacogr/ethapi-js?branch=master)
[![Dependency Status](https://david-dm.org/jacogr/ethapi-js.svg)](https://david-dm.org/jacogr/ethapi-js)
[![devDependency Status](https://david-dm.org/jacogr/ethapi-js/dev-status.svg)](https://david-dm.org/jacogr/ethapi-js#info=devDependencies)

## contributing

Clone the repo and install dependencies via `npm install`. Tests can be executed via

- `npm run testOnce` (100% covered unit tests)
- `npm run testE2E` (E2E against a running RPC-enabled testnet Parity/Geth instance, `parity --testnet --rpc`)
- `DEBUG=true npm run testE2E` (display RPC POST bodies and subsequent responses)

## installation

Install the package with `npm install --save ethapi-js` from the [npm registry ethapi-js](https://www.npmjs.com/package/ethapi-js)

## usage

### initialisation

```javascript
// import the actual EthApi class
import EthApi from 'ethapi-js';

// do the setup
const transport = new EthApi.Transports.JsonRpc('127.0.0.1', 8545);
const ethapi = new EthApi(transport);
```

You will require native Promises and fetch support (latest browsers only), they can be utilised by

```javascript
import 'isomorphic-fetch';

import es6Promise from 'es6-promise';
es6Promise.polyfill();
```

### making calls

perform a call

```javascript
ethapi.eth
  .coinbase()
  .then((coinbase) => {
    console.log(`The coinbase is ${coinbase}`);
  });
```

multiple promises

```javascript
Promise
  .all([
    ethapi.eth.coinbase(),
    ethapi.net.listening()
  ])
  .then(([coinbase, listening]) => {
    // do stuff here
  });
```

chaining promises

```javascript
ethapi.eth
  .newFilter({...})
  .then((filterId) => ethapi.eth.getFilterChanges(filterId))
  .then((changes) => {
    console.log(changes);
  });
```

### contracts

attach contract

```javascript
const abi = [{ name: 'callMe', inputs: [{ type: 'bool', ...}, { type: 'string', ...}]}, ...abi...];
const contract = new EthApi.Contract(ethapi, abi);
```

find & call a function

```javascript
contract.functions
  .find((func) => func.name === 'callMe')
  .call({ gas: 21000 }, [true, 'someString']) // or estimateGas or sendTransaction
  .then((result) => {
    console.log(`the result was ${result}`);
  });
```

parse events from transaction receipt

```javascript
contract
  .parseTransactionEvents(txReceipt)
  .then((receipt) => {
    receipt.logs.forEach((log) => {
      console.log('log parameters', log.params);
    });
  });
```

## apis

For a list of the exposed APIs, along with their parameters, the following exist. These implement the calls as listed on the official [JSON Ethereum RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) definition.

### ethapi.db.<...>

The interfaces maps through to the RPC `db_<interface>` definition. These are deprecated and may not be available in all clients into the future

- `getHex(dbName, keyName)` - retrieves a stored data value from the database
- `getString(dbName, keyName)` - retrieves a stored string from the database
- `putHex(dbName, keyName, hexData)` - stores a data value in the local database
- `putString(dbName, keyName, stringData)` - stores a string in the local database

### ethapi.eth.<...>

The interfaces maps through to the RPC `eth_<interface>` definition.

- `accounts()` - returns a list of accounts associated with the current running instance
- `blockNumber()` - returns the current blockNumber
- `call(options, blockNumber = 'latest')` - performs a call
- `coinbase()` - returns the current coinbase (base account) for the running instance
- `compile[LLL|Serpent|Solidity](code)` - compiles the supplied code using the required compiler
- `estimateGas(options)` - performs a *fake* call using the options, returning the used gas
- `fetchQueuedTransactions()`
- `flush()`
- `gasPrice()` - returns the current gas price
- `getBalance(address, blockNumber = 'latest')` - returns the current address balance as at blockNumber
- `getBlockByHash(hash, full = false)` - gets the block by the specified hash
- `getBlockByNumber(blockNumber = 'latest', full = false)` - gets the block by blockNumber
- `getBlockTransactionCountByHash(hash)` - transaction count in specified hash
- `getBlockTransactionCountByNumber(blockNumber = 'latest')` - transaction count by blockNumber
- `getCode(address, blockNumber = 'latest')` - get the deployed code at address
- `getCompilers()` - get a list of the available compilers
- `getFilterChanges(filterId)` - returns the changes to a specified filterId
- `getFilterChangesEx(filterId)`
- `getFilterLogs(filterId)` - returns the logs for a specified filterId
- `getFilterLogsEx(filterId)`
- `getLogs(options)` - returns logs
- `getLogsEx(options)`
- `getStorageAt(address, index = 0, blockNumber = 'latest')` - retrieve the store at address
- `getTransactionByBlockHashAndIndex(hash, index = 0)`
- `getTransactionByBlockNumberAndIndex(blockNumber = 'latest', index = 0)`
- `getTransactionByHash(hash)`
- `getTransactionCount(address, blockNumber = 'latest')`
- `getTransactionReceipt(txhash)`
- `getUncleByBlockHashAndIndex(hash, index = 0)`
- `getUncleByBlockNumberAndIndex(blockNumber = 'latest', index = 0)`
- `getUncleCountByBlockHash(hash)`
- `getUncleCountByBlockNumber(blockNumber = 'latest')`
- `getWork()`
- `hashrate()`
- `inspectTransaction()`
- `mining()`
- `newBlockFilter()`
- `newFilter(options)`
- `newFilterEx(options)`
- `notePassword()`
- `newPendingTransactionFilter()`
- `pendingTransactions()`
- `protocolVersion()`
- `register()`
- `sendRawTransaction(data)`
- `sendTransaction(options)`
- `sign()`
- `signTransaction()`
- `submitHashrate(hashrate, clientId)`
- `submitWork(nonce, powHash, mixDigest)`
- `syncing()`
- `uninstallFilter(filterId)`
- `unregister()`

*TODO* complete the descriptions where not available

### ethapi.ethcore.<...>

The interfaces maps through to the RPC `ethcore_<interface>` definition, extensions done by Ethcore on the Parity client.

- `extraData()` - returns currently set extra data
- `gasFloorTarget()` - returns current target for gas floor
- `minGasPrice()` - returns currently set minimal gas price
- `netChain()` - returns the name of the connected chain
- `netMaxPeers()` - returns maximal number of peers
- `netPort()` - returns network port the node is listening on
- `nodeName()` - returns node name (identity)
- `setAuthor(address)` - changes author (coinbase) for mined blocks
- `setExtraData(data)` - changes extra data for newly mined blocks
- `setGasFloorTarget(quantity)` - changes current gas floor target
- `setMinGasPrice(quantity)` - changes minimal gas price for transaction to be accepted to the queue
- `setTransactionsLimit(quantity)` - changes limit for transactions in queue
- `transactionsLimit()` - returns limit for transactions in queue
- `rpcSettings()` - returns basic settings of rpc (enabled, port, interface)

### ethapi.net.<...>

The interfaces maps through to the RPC `net_<interface>` definition.

- `listening()` - returns the listening status of the network
- `peerCount()` - returns the number of connected peers
- `version()` - returns the network version

### ethapi.personal.<...>

The interfaces maps through to the RPC `personal_<interface>` definition.

- `listAccounts()` - list all the available accounts
- `newAccount(password)` - creates a new account
- `signAndSendTransaction(txObject, password)` - sends and signs a transaction given account passphrase
- `unlockAccount(account, password, duration = 5)` - unlocks the account

### ethapi.shh.<...>

The interfaces maps through to the RPC `shh_<interface>` definition.

- `addToGroup(identity)`
- `getFilterChanges(filterId)`
- `getMessages(filterId)`
- `hasIdentity(identity)`
- `newFilter(options)`
- `newGroup()`
- `newIdentity()`
- `post(options)`
- `uninstallFilter(filterId)`
- `version()`

*TODO* complete the descriptions where not available

### ethapi.trace.<...>

The interfaces maps through to the RPC `trace_<interface>` definition.

- `filter(filterObj)` - returns traces matching given filter
- `get(txHash, position)` - returns trace at given position
- `transaction(txHash)` - returns all traces of given transaction
- `block(blockNumber = 'latest')` - returns traces created at given block

### ethapi.web3.<...>

The interfaces maps through to the RPC `web3_<interface>` definition.

- `clientVersion()` - returns the version of the RPC client
- `sha3(hexStr)` - returns a keccak256 of the hexStr input
