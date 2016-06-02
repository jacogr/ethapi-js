import BigNumber from 'bignumber.js';

import { isInstanceOf, isString } from './types';

export function fromNumber (number) {
  return new BigNumber(number);
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

  return toHexNumber(blockNumber);
}

export function toHexNumber (number) {
  if (isInstanceOf(number, BigNumber)) {
    return `0x${number.toString(16)}`;
  }

  return `0x${(new BigNumber(number)).toString(16)}`;
}
