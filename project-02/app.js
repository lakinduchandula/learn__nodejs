const http = require('http');

// 3rd party libraries
const express = require('express');

const app = express(); // this express will handle almost very thing in behind the scenes

const server = http.createServer(app); // app is valid request handler

server.listen(3000); // this line will listen through port 3000 when it's done it will run line 3
