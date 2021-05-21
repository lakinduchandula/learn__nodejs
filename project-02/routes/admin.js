const adminController = require("../controllers/admin");
const express = require("express");

const routes = express.Router();

// we can put get, post method insted of use after app. ,
// reach under /admin/add-product => GET
routes.get("/add-product", adminController.getAddProduct);

// reach under /admin/product => GET
routes.get("/products", adminController.getProducts);

// app.post mean it will only run under post method
// reach under /admin/add-product => POST
routes.post("/add-product", adminController.postAddProduct);

routes.get("/edit-product/:productId", adminController.getEditProduct);

module.exports = routes;
