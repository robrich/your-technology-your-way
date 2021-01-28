import https from 'https';
import { readFile } from 'fs/promises';
import app from './app.js';
import grpc from './grpc.js';

const port = process.env.PORT || 3000;
app.set('port', port);
const grpcPort = 3001;

const cert = {
  key: await readFile('../.cert/devcert.key'),
  cert: await readFile('../.cert/devcert.pem')
};
const server = https.createServer(cert, app);
// no cert? use this:
//import http from 'http';
//const server = http.createServer(app);

server.listen(port, function (err) {
  if (err) {
    console.log(`Error starting on ${port}`, err);
    process.exit(1);
  }
  console.log(`listening https on port ${port}`);
});

console.log(`listening for gRPC on port ${grpcPort}`);
grpc(grpcPort);
