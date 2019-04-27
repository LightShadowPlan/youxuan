const app = require('../app');
const debug = require('debug')('back-end:server');
const http = require('http');
const fs = require('fs');
const https = require('https');
const webSocket = require('../controllers/webSocket');

const privateKey = fs.readFileSync('./ssl/0_lightshadow.xyz.key', 'utf8');

const certificate = fs.readFileSync('./ssl/1_lightshadow.xyz_bundle.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate};

const httpserver = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpserver.listen(3000);
httpserver.on('error', onError);

httpsServer.listen(3443);
httpsServer.on('error', onError);

webSocket()

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
