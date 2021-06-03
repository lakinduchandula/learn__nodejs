const adminController = require("../controllers/admin");
const isAuthenticated = require("../middleware/isAuth");

const express = require("express");
const { body } = require("express-validator");

const routes = express.Router();

// we can put get, post method insted of use after app. ,
// reach under /admin/add-product => GET
routes.get("/add-product", isAuthenticated, adminController.getAddProduct);

// reach under /admin/product => GET
routes.get("/products", isAuthenticated, adminController.getProducts);

// app.post mean it will only run under post method
// reach under /admin/add-product => POST
routes.post(
  "/add-product",
  [
    body("title", "Validation Error on Title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl", "Validation Error on ImageUrl"),
    body("price", "Validation Error on Price").isFloat(),
    body("description", "Validation Error on Description").isLength({ min: 10, max: 200 }).trim(),
  ],
  isAuthenticated,
  adminController.postAddProduct
);

routes.get(
  "/edit-product/:productId",
  isAuthenticated,
  adminController.getEditProduct
);

// this route is to update the product
routes.post(
  "/edit-product",
  [
    body("title", "Validation Error on Title").isString().isLength({ min: 3 }),
    body("imageUrl", "Validation Error on ImageUrl"),
    body("price", "Validation Error on Price").isFloat(),
    body("description", "Validation Error on Description").isLength({ min: 10, max: 200 }).trim(),
  ],
  isAuthenticated,
  adminController.postEditProduct
);

routes.delete(
  "/products/:productId",
  isAuthenticated,
  adminController.deleteProduct
);

module.exports = routes;
