const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  //  this send(); method can use to send a almost any response
  res.send("<h1>Hello from express.js</h1>");
});

module.exports = router;
