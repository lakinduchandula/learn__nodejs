const http = require('http');

// custom imports
const routes = require('./routes')

const server = http.createServer(routes);

server.listen(3000); // this line will listen through port 3000 when it's done it will run line 3
