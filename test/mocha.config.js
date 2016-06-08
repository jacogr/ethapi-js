import 'isomorphic-fetch';

import es6Promise from 'es6-promise';
es6Promise.polyfill();

import chai from 'chai';
import sinonChai from 'sinon-chai';
import { w3cwebsocket } from 'websocket';

chai.use(sinonChai);

global.expect = chai.expect;
global.WebSocket = w3cwebsocket;
