import EthApi from '../lib';

const transport = new EthApi.Transports.JsonRpc('127.0.0.1', 8545);
const ethapi = new EthApi(transport);

transport.setDebug(true);

export default ethapi;
