export default class JsonRpcBase {
  constructor () {
    this._id = 1;
  }

  encode (method, params) {
    return JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: this._id++
    });
  }
}
