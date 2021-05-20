const express = require("express");

// custom libraries
const shopController = require("../controllers/shop");

const router = express.Router();

// this will handle all added products
router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/cart", shopController.getCart);

router.get("/checkout", shopController.getCheckout);


module.exports = router;
