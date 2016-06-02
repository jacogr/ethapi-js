import BigNumber from 'bignumber.js';

import { isInstanceOf, isString } from './types';

export function fromNumber (number) {
  return new BigNumber(number || 0);
}

export function toBlockNumber (blockNumber) {
  if (isString(blockNumber)) {
    switch (blockNumber) {
      case 'earliest':
      case 'latest':
      case 'pending':
        return blockNumber;
    }
  }

  return toNumber(blockNumber);
}

export function toHex (str) {
  if (str && str.substr(0, 2) === '0x') {
    return str;
  }

  return `0x${str || ''}`;
}

export function toNumber (number) {
  if (isInstanceOf(number, BigNumber)) {
    return toHex(number.toString(16));
  }

  return toHex((new BigNumber(number || 0)).toString(16));
}
