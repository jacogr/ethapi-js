/* global fetch */
export default class JsonRpc {
  constructor (host, port) {
    this._host = host;
    this._port = port;
    this._id = 1;
    this._debug = false;
  }

  _encodeBody (method, params) {
    return JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: this._id++
    });
  }

  _encodeOptions (method, params) {
    const json = this._encodeBody(method, params);

    return {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': json.length
      },
      body: json
    };
  }

  _getEndpoint () {
    return `http://${this._host}:${this._port}/`;
  }

  execute (method, ...params) {
    return fetch(this._getEndpoint(), this._encodeOptions(method, params))
      .then((response) => {
        if (response.status !== 200) {
          if (this._debug) {
            console.error('   ', `${method}(${params}) throws`, response.status, response.statusText);
          }

          throw new Error(`${response.status}: ${response.statusText}`);
        }

        return response.json();
      })
      .then((result) => {
        if (result.error) {
          if (this._debug) {
            console.error('   ', `${method}(${params}) =`, result);
          }

          throw new Error(`${result.error.code}: ${result.error.message}`);
        }

        if (this._debug) {
          console.log('   ', `${method}(${params}) =`, result.result);
        }

        return result.result;
      });
  }

  setDebug (flag) {
    this._debug = flag;
  }
}
