const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const orderRepository = require('./data/order-repository');
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

function main(port) {
  const server = new grpc.Server();
  server.addService(ordersHandler.OrdersManager.service, {
    GetNewOrder: util.callbackify(getNewOrder),
    UpdateOrder: util.callbackify(updateOrder)
  });
  server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
  server.start(); // doesn't return
}

// un-callbackify'd is getNewOrder(req, callback) so can't trim unused parameter
async function getNewOrder(req) {
  const orderId = await orderRepository.getNextPending();
  console.log(`gRPC called, returning orderId ${orderId}`);
  return {orderId};
}

async function updateOrder(req) {
  await orderRepository.update(req.request);
}

module.exports = main;
