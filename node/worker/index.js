import grpc from 'grpc';
import protoLoader from '@grpc/proto-loader';
import { promisify } from 'util';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = resolve(__dirname+'/protos/ordershandler.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const ordersHandler = grpc.loadPackageDefinition(packageDefinition).OrdersHandler;

const PORT = '3001';
//const PORT = '5001';

main();
async function main() {
  const pem = await fs.readFile('../.cert/devcert.pem');
  console.log(`starting up Node service at ${new Date().toLocaleTimeString()}`);
  const client = new ordersHandler.OrdersManager(`localhost:${PORT}`, grpc.credentials.createSsl(pem)); // .createInsecure());
  // no cert? use this:
  //const client = new ordersHandler.OrdersManager(`localhost:${PORT}`, grpc.credentials.createInsecure());
  client.GetNewOrder = promisify(client.GetNewOrder);
  client.UpdateOrder = promisify(client.UpdateOrder);
  processOrder(client);
}

async function processOrder(client) {
  try {
    const res = await client.GetNewOrder({});
    if (res.orderId) {
      console.log(`processing order id ${res.orderId}`);
      await client.UpdateOrder({orderId: res.orderId, status:'Processed'});
    } else {
      console.log(`no orders to process at ${new Date().toLocaleTimeString()}`);
    }
  } catch (err) {
    console.log('error', err);
  }
  // get the next one ... after this one finishes
  setTimeout(() => {
    processOrder(client);
  }, 3000);
}
