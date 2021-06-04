const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const feedRouter = require("./routes/feed");

app.use(express.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // this allow to setHeaders from every domain
  res.setHeader(    // this is about what methods that can used by the clients
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH" // examples which methods can use to connect with end points
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // what headers can set by the client
  next(); // we have pass the req to next middlwhere
});

app.use("/feed", feedRouter);

app.listen(8080);
