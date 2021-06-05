const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const feedRouter = require("./routes/feed");

app.use(express.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));

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

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).json({ message: message });
});

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
