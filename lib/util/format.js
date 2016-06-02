import BigNumber from 'bignumber.js';

import { isInstanceOf, isString } from './types';

export function fromAddress (address) {
  // TODO: address conversion to upper-lower
  return address;
}

export function fromNumber (number) {
  return new BigNumber(number || 0);
}

export function toAddress (address) {
  // TODO: address validation if we have upper-lower addresses
  return toHex((address || '').toLowerCase());
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
