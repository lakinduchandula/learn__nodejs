const adminController = require("../controllers/admin");
const isAuthenticated = require("../middleware/isAuth");

const express = require("express");

const routes = express.Router();

// we can put get, post method insted of use after app. ,
// reach under /admin/add-product => GET
routes.get("/add-product", isAuthenticated, adminController.getAddProduct);

// reach under /admin/product => GET
routes.get("/products", isAuthenticated, adminController.getProducts);

// app.post mean it will only run under post method
// reach under /admin/add-product => POST
routes.post("/add-product", isAuthenticated, adminController.postAddProduct);

routes.get("/edit-product/:productId", isAuthenticated, adminController.getEditProduct);

// this route is to update the product
routes.post("/edit-product", isAuthenticated, adminController.postEditProduct);

routes.post("/delete-product", isAuthenticated, adminController.postDeleteProduct);

module.exports = routes;
