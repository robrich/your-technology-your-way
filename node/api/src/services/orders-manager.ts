import { sendUnaryData, ServerUnaryCall, UntypedHandleCall } from '@grpc/grpc-js';
import { OrdersManagerServer, OrdersManagerService, NewOrderRequest, NewOrderReply, UpdateOrderReply, UpdateOrderRequest } from '../models/ordershandler';
import { getNextPending, update } from '../data/order-repository.js';

class OrdersManager implements OrdersManagerServer {
  [method: string]: UntypedHandleCall;

  public async getNewOrder(call: ServerUnaryCall<NewOrderRequest, NewOrderReply>, callback: sendUnaryData<NewOrderReply>): Promise<void> {

    const orderId = await getNextPending();
    console.log(`gRPC called, returning orderId ${orderId}`);
    const res: NewOrderReply = {orderId};

    callback(null, NewOrderReply.fromJSON(res));
  }

  public async updateOrder(call: ServerUnaryCall<UpdateOrderRequest, UpdateOrderReply>, callback: sendUnaryData<UpdateOrderReply>): Promise<void> {

    const req: UpdateOrderRequest = call.request;
    const { orderId, status } = req;
    await update({orderId, status});

    const res: UpdateOrderReply = {orderId, status};

    callback(null, UpdateOrderReply.fromJSON(res));
  }

}

export {
  OrdersManager,
  OrdersManagerService,
};
