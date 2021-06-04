const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const feedRouter = require("./routes/feed");

app.use(express.json()); // application/json

app.use("/feed", feedRouter);

app.listen(8080);
