# ethapi-js

A thin Promise-based wrapper around the Eth APIs.

[![Build Status](https://travis-ci.org/jacogr/ethapi-js.svg?branch=master)](https://travis-ci.org/jacogr/ethapi-js)
[![Coverage Status](https://coveralls.io/repos/github/jacogr/ethapi-js/badge.svg?branch=master)](https://coveralls.io/github/jacogr/ethapi-js?branch=master)
[![Dependency Status](https://david-dm.org/jacogr/ethapi-js.svg)](https://david-dm.org/jacogr/ethapi-js)
[![devDependency Status](https://david-dm.org/jacogr/ethapi-js/dev-status.svg)](https://david-dm.org/jacogr/ethapi-js#info=devDependencies)

## getting going

- clone
- `npm install`
- `npm run testOnce`

## usage

```
// import the transport (currently only JSON RPC)
import JsonRpc from 'ethapi-js/lib/transport/jsonRpc';

// import the actual EthApi class
import EthApi from 'ethapi-js';

// do the setup
const transport = new JsonRpc('127.0.0.1', 8545);
const ethapi = new EthApi(transport);

// perform a call
ethapi.eth
  .coinbase()
  .then((coinbase) => {
    console.log(`The coinbase is ${coinbase}`);
  });

// multiple promises
Promise
  .all([ethapi.eth.coinbase, ethapi.net.listening])
  .then(([coinbase, listening]) => {
    // do stuff here
  });
```

## apis

For a list of the exposed APIs, along with their parameters, the following exist. These implement the calls as listed on the official [JSON Ethereum RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) definition.

### ethapi.eth.<...>

In most cases, the interfaces maps through to the RPC `eth_<interface>` definition.

- `accounts()` - returns a list of accounts associated with the current running instance
- `blockNumber()` - returns the current blockNumber
- `call(options, blockNumber = 'latest')` - performs a call
- `coinbase()` - returns the current coinbase (base account) for the running instance
- `compile[LLL|Serpent|Solidity](code)` - compiles the supplied code using the required compiler
- `estimateGas(options)` - performs a *fake* call uisng the options, returning the used gas
- `gasPrice()` - returns the current gas price
- `getBalance(address, blockNumber = 'latest')` - returns the current address balance as at blockNumber

*TODO* complete the rest

### ethpai.net.<...>

*TODO* complete the rest

### ethapi.personal.<...>

*TODO* complete the rest

### ethapi.shh.<...>

*TODO* complete the rest

### ethapi.web3.<...>

- `clientVersion()` - returns the version of the RPC client
- `sha3(hexStr)` - returns a keccak256 of the hexStr input
