import JsonRpcBase from './jsonRpcBase';

/* global fetch */
export default class Http extends JsonRpcBase {
  constructor (hostOrPath, port) {
    super();

    this._host = hostOrPath;
    this._port = port;
    this._debug = false;
  }

  _encodeOptions (method, params) {
    const json = this.encode(method, params);

    if (this._debug) {
      console.log('>', json);
    }

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
    if (!this._port) {
      return this._host;
    }

    return `http://${this._host}:${this._port}/`;
  }

  execute (method, ...params) {
    return fetch(this._getEndpoint(), this._encodeOptions(method, params))
      .then((response) => {
        if (response.status !== 200) {
          if (this._debug) {
            console.error('<', JSON.stringify({ status: response.status, statusText: response.statusText }));
          }

          throw new Error(`${response.status}: ${response.statusText}`);
        }

        return response.json();
      })
      .then((result) => {
        if (result.error) {
          if (this._debug) {
            console.error('<', JSON.stringify(result));
          }

          throw new Error(`${result.error.code}: ${result.error.message}`);
        }

        if (this._debug) {
          console.log('<', JSON.stringify(result));
        }

        return result.result;
      });
  }

  setDebug (flag) {
    this._debug = flag;
  }
}
