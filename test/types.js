import BigNumber from 'bignumber.js';

export { isFunction, isInstanceOf } from '../lib/util/types';

export function isAddress (address) {
  if (address.length !== 42) {
    return false;
  }

  return isHexNumber(address);
}

export function isBoolean (test) {
  return Object.prototype.toString.call(test) === '[object Boolean]';
}

export function isHexNumber (test) {
  if (test.substr(0, 2) !== '0x') {
    return false;
  }

  return (new BigNumber(test, 16)).toString(16) === test.substr(2);
}
