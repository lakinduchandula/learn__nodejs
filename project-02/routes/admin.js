const path = require('path');
const express = require("express");

const routes = express.Router();

const products = [] ;

// we can put get, post method insted of use after app. ,
// reach under /admin/add-product => GET
routes.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

// app.post mean it will only run under post method
// reach under /admin/add-product => POST
routes.post("/add-product", (req, res, next) => {
  products.push({title: req.body.title});
  res.redirect("/");
});

exports.routes = routes;
exports.products = products;
