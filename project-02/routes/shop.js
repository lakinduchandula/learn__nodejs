const express = require("express");

// custom libraries
const productsController = require("../controllers/products");

const router = express.Router();

// this will handle all added products
router.get("/", productsController.getProducts);

module.exports = router;
