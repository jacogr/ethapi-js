import BigNumber from 'bignumber.js';

import { isInstanceOf, isString } from './types';

export function outAddress (address) {
  // TODO: address conversion to upper-lower
  return address;
}

export function outNumber (number) {
  return new BigNumber(number || 0);
}

export function inAddress (address) {
  // TODO: address validation if we have upper-lower addresses
  return inHex((address || '').toLowerCase());
}

export function inBlockNumber (blockNumber) {
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

export function inData (data) {
  return inHex(data);
}

export function inHex (str) {
  if (str && str.substr(0, 2) === '0x') {
    return str;
  }

  return `0x${str || ''}`;
}

export function inNumber10 (number) {
  if (isInstanceOf(number, BigNumber)) {
    return number.toNumber();
  }

  return (new BigNumber(number || 0)).toNumber();
}

export function inNumber16 (number) {
  if (isInstanceOf(number, BigNumber)) {
    return inHex(number.toString(16));
  }

  return inHex((new BigNumber(number || 0)).toString(16));
}
