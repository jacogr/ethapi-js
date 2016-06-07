import JsonRpcBase from '../jsonRpcBase';

/* global WebSocket */
export default class Ws extends JsonRpcBase {
  constructor (url, protocols) {
    super();

    this._messages = {};
    this._open = false;

    this._ws = new WebSocket(url, protocols);
    this._ws.onopen = this._onOpen;
    this._ws.onclose = this._onClose;
    this._ws.onmessage = this._onMessage;
  }

  get isOpen () {
    return this._open;
  }

  _onOpen = (event) => {
    if (this.isDebug) {
      console.log('<', event);
    }

    this._open = true;
  }

  _onClose = (event) => {
    if (this.isDebug) {
      console.log('<', event);
    }

    this._open = false;
  }

  _onMessage = (event) => {
    const result = JSON.parse(event.data);
    const {resolve, reject} = this._messages[result.id];

    if (result.error) {
      if (this.isDebug) {
        console.error('<', event.data);
      }

      reject(new Error(`${result.error.code}: ${result.error.message}`));
      delete this._messages[result.id];
      return;
    }

    if (this.isDebug) {
      console.log('<', event.data);
    }

    resolve(result.result);
    delete this._messages[result.id];
  }

  execute (method, ...params) {
    return new Promise((resolve, reject) => {
      this._messages[this.id] = { resolve: resolve, reject: reject };
      const json = this.encode(method, params);

      if (this.isDebug) {
        console.log('>', json);
      }

      this._ws.send(json);
    });
  }
}
