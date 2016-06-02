import BigNumber from 'bignumber.js';

export { isFunction, isInstanceOf } from '../lib/util/types';

export function isAddress (address) {
  if (address.length !== 42) {
    return false;
  }

  return isHexNumber(address);
}

export function isHexNumber (number) {
  if (number.substr(0, 2) !== '0x') {
    return false;
  }

  return (new BigNumber(number, 16)).toString(16) === number.substr(2);
}
