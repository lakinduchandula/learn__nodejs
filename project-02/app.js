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
  res.send('<h1>Hello from express.js</h1>'); //  this send(); method can use to send a almost any response
});

app.listen(3000); // this will do both creating server and listen on port 3000
