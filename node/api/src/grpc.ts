import { Server, ServerCredentials } from '@grpc/grpc-js';
import { OrdersManager, OrdersManagerService } from './services/orders-manager';
import { promisify } from 'util';

export default async function main(port: Number, cert: {private_key: Buffer, cert_chain: Buffer}): Promise<number> {
  const caCert = null;
  const checkClientCert = false;

  const server = new Server({
    'grpc.max_receive_message_length': -1,
    'grpc.max_send_message_length': -1,
  });

  server.addService(OrdersManagerService, new OrdersManager());

  const bindAsync = promisify(server.bindAsync).bind(server);

  const bindPort = await bindAsync(`0.0.0.0:${port}`, ServerCredentials.createSsl(caCert, [cert], checkClientCert));

  server.start();

  return bindPort;
}
