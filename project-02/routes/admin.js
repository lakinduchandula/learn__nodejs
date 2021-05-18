const productsController = require('../controllers/products');
const express = require("express");

const routes = express.Router();

// we can put get, post method insted of use after app. ,
// reach under /admin/add-product => GET
routes.get("/add-product", productsController.getAddProduct);

// app.post mean it will only run under post method
// reach under /admin/add-product => POST
routes.post("/add-product", productsController.postAddProduct);

module.exports = routes;

