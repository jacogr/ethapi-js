import nock from 'nock';

export const TEST_HOST = '127.0.0.1';
export const TEST_PORT = 6688;

export function mockRpc (requests) {
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

export function endpointTest (instance, moduleId, name) {
  let scope;

  before(() => {
    scope = mockRpc([{ method: `${moduleId}_${name}`, reply: {} }]);
    return instance[name]();
  });

  it(`maps ${moduleId}_${name}`, () => {
    expect(scope.isDone()).to.be.true;
  });
}

export function endpointDescribe (instance, moduleId) {
  describe('endpoints', () => {
    Object
      .getOwnPropertyNames(Object.getPrototypeOf(instance))
      .filter((name) => name !== 'constructor')
      .forEach((name) => endpointTest(instance, moduleId, name));
  });
}
