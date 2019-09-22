const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const util = require('util');

const PROTO_PATH = __dirname+'/protos/ordershandler.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const ordersHandler = grpc.loadPackageDefinition(packageDefinition).OrdersHandler;

const PORT = '30051';

main();
function main() {
  console.log(`starting up Node service at ${new Date().toLocaleTimeString()}`);
  const client = new ordersHandler.OrdersManager(`localhost:${PORT}`, grpc.credentials.createInsecure());
  client.GetNewOrder = util.promisify(client.GetNewOrder);
  client.UpdateOrder = util.promisify(client.UpdateOrder);
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
