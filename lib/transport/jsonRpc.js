import isoFetch from 'isomorphic-fetch'; // eslint-disable-line no-unused-vars

export default class JsonRPC {
  constructor (host, port) {
    this._host = host;
    this._port = port;
    this._id = 1;
  }

  execute (method, ...params) {
    const json = JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: this._id++
    });

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': json.length
      },
      body: json
    };

    return fetch(`http://${this._host}:${this._port}/`, options) // eslint-disable-line no-undef
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
