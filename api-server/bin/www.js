const app = require('../app');
const debug = require('debug')('back-end:server');
const http = require('http');
const webSocket = require('../controllers/webSocket');


const httpserver = http.createServer(app);

httpserver.listen(3000);


webSocket()
