import EthAbi from 'ethabi-js';
import EthApi from '../ethApi';
import { isInstanceOf } from '../util/types';

export default class Contract {
  constructor (eth, abi) {
    if (!isInstanceOf(eth, EthApi)) {
      throw new Error('EthApi needs to be provided to Contract instance');
    } else if (!abi) {
      throw new Error('Object ABI needs to be provided to Contract instance');
    }

    this._eth = eth;
    this._abi = new EthAbi(abi);
  }

  at (address) {
    this._address = address;
    return this;
  }

  get address () {
    return this._address;
  }

  get eth () {
    return this._eth;
  }

  get abi () {
    return this._abi;
  }
}
