const express = require("express");
const mongoose = require("mongoose");

const app = express();

const feedRouter = require("./routes/feed");

app.use(express.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // this allow to setHeaders from every domain
  res.setHeader(
    // this is about what methods that can used by the clients
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH" // examples which methods can use to connect with end points
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // what headers can set by the client
  next(); // we have pass the req to next middlwhere
});

app.use("/feed", feedRouter);

mongoose
  .connect(
    "mongodb+srv://online-shop-node-application:6C65rHM7bQbxsPPn@cluster0.fjhfb.mongodb.net/chat",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    console.log("Connected to Monogodb Atlas!");
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
