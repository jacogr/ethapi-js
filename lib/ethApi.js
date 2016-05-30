import es6Promise from 'es6-promise';
es6Promise.polyfill();

import { Eth, Net, Personal, Shh, Web3 } from './rpc';
import { isFunction } from './util/types';

export default class EthApi {
  constructor (transport) {
    if (!transport || !isFunction(transport.execute)) {
      throw new Error('EthAbi needs transport with execute() function defined');
    }

    this._eth = new Eth(transport);
    this._net = new Net(transport);
    this._personal = new Personal(transport);
    this._shh = new Shh(transport);
    this._web3 = new Web3(transport);
  }

  get eth () {
    return this._eth;
  }

  get net () {
    return this._net;
  }

  get personal () {
    return this._personal;
  }

  get shh () {
    return this._shh;
  }

  get web3 () {
    return this._web3;
  }
}
