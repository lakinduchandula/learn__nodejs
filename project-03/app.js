const express = require("express");

const app = express();

const feedRouter = require("./routes/feed");

app.use("/feed", feedRouter);

app.listen(8080);
