import isoFetch from 'isomorphic-fetch'; // eslint-disable-line no-unused-vars

export default class JsonRpc {
  constructor (host, port) {
    this._host = host;
    this._port = port;
    this._id = 1;
  }

  encodeBody (method, params) {
    return JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: this._id++
    });
  }

  execute (method, ...params) {
    const json = this.encodeBody(method, params);

    return fetch(`http://${this._host}:${this._port}/`, // eslint-disable-line no-undef
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': json.length
        },
        body: json
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((result) => {
        if (result.error) {
          throw new Error(result.error);
        }

        return result.result;
      });
  }
}
