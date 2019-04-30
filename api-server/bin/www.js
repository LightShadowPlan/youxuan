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

httpsServer.listen(3443);

webSocket()
