import { credentials, ServiceError } from '@grpc/grpc-js';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { OrdersManagerClient, NewOrderRequest, NewOrderReply, UpdateOrderReply, UpdateOrderRequest } from './models/ordershandler';


const PORT = parseInt(process.env.PORT || '3001', 10);
//const PORT = 5001;


const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(`starting up Node service at ${new Date().toLocaleTimeString()} for gRPC to ${PORT}`);

  // https://github.com/grpc/grpc/blob/master/doc/keepalive.md
  // https://cloud.ibm.com/docs/blockchain-multicloud?topic=blockchain-multicloud-best-practices-app#best-practices-app-connections
  const grpcOptions = {
  'grpc.keepalive_time_ms': 120000,
  'grpc.http2.min_time_between_pings_ms': 120000,
  'grpc.keepalive_timeout_ms': 20000,
  'grpc.http2.max_pings_without_data': 0,
  'grpc.keepalive_permit_without_calls': 1,
};

const pem = await readFile(join(__dirname, '../../.cert/devcert.pem'));
const client: OrdersManagerClient = new OrdersManagerClient(`localhost:${PORT}`, credentials.createSsl(pem), grpcOptions);
// no cert? use this:
//const client = new OrdersManagerClient(`localhost:${PORT}`, credentials.createInsecure(), grpcOptions);

const getNewOrder = promisify(client.getNewOrder).bind(client);
const updateOrder = promisify(client.updateOrder).bind(client);


processOrder();// start it off

async function processOrder() {
  try {
    const req: NewOrderRequest = {};
    const res = await getNewOrder(req) as NewOrderReply;
    const { orderId } = res;
    if (!orderId) {
      console.log(`no orders to process at ${new Date().toLocaleTimeString()}`);
    } else {
      console.log(`processing order id ${res.orderId}`);
      const updateReq: UpdateOrderRequest = {
        orderId,
        status: 'Processed by Node.js'
      };
      await updateOrder(updateReq);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(`error: ${err.message}`, {err});
    } else {
      console.log('error', {err});
    }
  }
  // ask for another after we finished this one
  setTimeout(() => {
    processOrder();
  }, 3000);
}
