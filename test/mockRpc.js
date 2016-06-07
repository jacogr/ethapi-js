import nock from 'nock';
import { MockServer } from 'mock-socket';

import { isFunction } from '../lib/util/types';

export const TEST_HOST = '127.0.0.1';
export const TEST_PORT = 6688;
export const TEST_WS = 'ws://localhost:8866';

export function mockHttp (requests) {
  let scope = nock(`http://${TEST_HOST}:${TEST_PORT}`);

  requests.forEach((request) => {
    scope = scope
      .post('/')
      .reply(request.code || 200, (uri, body) => {
        if (body.method !== request.method) {
          return {
            error: `Invalid method ${body.method}, expected ${request.method}`
          };
        }

        scope.body = scope.body || {};
        scope.body[request.method] = body;

        return request.reply;
      });
  });

  return scope;
}

export function mockWs (requests) {
  const scope = { requests: 0, body: {} };
  const mockServer = new MockServer(TEST_WS);

  mockServer.on('message', (body) => {
    const input = JSON.parse(body);
    const request = requests[scope.requests];

    request.reply.id = input.id;
    scope.body[request.method] = body;
    scope.requests++;

    mockServer.send(JSON.stringify(request.reply));
  });

  return scope;
}

export function endpointTest (instance, moduleId, name) {
  describe(name, () => {
    it(`has the ${moduleId}.${name} endpoint`, () => {
      expect(isFunction(instance[moduleId][name])).to.be.ok;
    });

    it(`maps to ${moduleId}_${name} via RPC`, () => {
      const scope = mockHttp([{ method: `${moduleId}_${name}`, reply: {} }]);

      return instance[moduleId][name]().then(() => {
        expect(scope.isDone()).to.be.true;
      });
    });
  });
}
