import grpc from 'grpc';
import protoLoader from '@grpc/proto-loader';
import { getNextPending, update } from './data/order-repository.js';
import { callbackify } from 'util';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = resolve(join(__dirname, 'protos/ordershandler.proto'));
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const ordersHandler = grpc.loadPackageDefinition(packageDefinition).OrdersHandler;

async function main(port) {
  const server = new grpc.Server();
  server.addService(ordersHandler.OrdersManager.service, {
    GetNewOrder: callbackify(getNewOrder),
    UpdateOrder: callbackify(updateOrder)
  });
  const cert = {
    private_key: await readFile('../.cert/devcert.key'),
    cert_chain: await readFile('../.cert/devcert.pem')
  };
  const caCert = null;
  const checkClientCert = false;
  server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createSsl(caCert, [cert], checkClientCert)); //.createInsecure());
  // no cert? use this:
  //server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
  server.start(); // doesn't return
}

// un-callbackify'd is getNewOrder(req, callback) so can't trim unused parameter
async function getNewOrder(req) {
  const orderId = await getNextPending();
  console.log(`gRPC called, returning orderId ${orderId}`);
  return {orderId};
}

async function updateOrder(req) {
  await update(req.request);
}

export default main;
