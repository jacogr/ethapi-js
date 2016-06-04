import EthApi from '../../lib';

const transport = new EthApi.Transports.Http('127.0.0.1', 8545);
const ethapi = new EthApi(transport);

if (process.env.DEBUG) {
  transport.setDebug(true);
}

export default ethapi;
