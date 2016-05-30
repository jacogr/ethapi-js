export function isFunction (test) {
  return Object.prototype.toString.call(test) === '[object Function]';
}

export function isInstanceOf (test, clazz) {
  return test instanceof clazz;
}
