import https, { Server } from 'https';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import app from './app';
import grpc from './grpc';

const port = parseInt(process.env.PORT || '3000', 10);
app.set('port', port);
const grpcPort = parseInt(process.env.GRPC_PORT || '3001', 10);

const __dirname = dirname(fileURLToPath(import.meta.url));

const cert = {
  key: await readFile(join(__dirname, '../../.cert/devcert.key')),
  cert: await readFile(join(__dirname, '../../.cert/devcert.pem'))
};
const server: Server = https.createServer(cert, app);
// no cert? use this:
//import http, { Server } from 'http';
//const server: Server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening for http on https://+:${port}`);
}).on('error', (e: Error) => {
  console.log(`Error starging on ${port}`, e);
});

await grpc(grpcPort, {private_key: cert.key, cert_chain: cert.cert});
console.log(`listening for gRPC on port ${grpcPort}`);
