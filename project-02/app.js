const http = require("http");

// 3rd party libraries
const express = require("express");

const app = express(); // this express will handle almost very thing in behind the scenes

app.use((req, res, next) => {
  // use allow us to add another middleware function
  /**
   * This function will run for every incoming request
   * next argument means that if we only call next();
   * then it will only allow travel to other middleware function
   * **/
  console.log("This is middleware");
  next();
});

app.use((req, res, next) => {
  console.log("This is another middleware");
});

const server = http.createServer(app); // app is valid request handler

server.listen(3000); // this line will listen through port 3000 when it's done it will run line 3
