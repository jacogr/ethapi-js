export default class JsonRpcBase {
  constructor () {
    this._id = 1;
    this._debug = false;
  }

  encode (method, params) {
    return JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: this._id++
    });
  }

  get id () {
    return this._id;
  }

  get isDebug () {
    return this._debug;
  }

  setDebug (flag) {
    this._debug = flag;
  }
}
