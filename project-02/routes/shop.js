const express = require("express");

// custom libraries
const shopController = require("../controllers/shop");

const router = express.Router();

// this will handle all added products
router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

/******************************** THEORY ********************************************* 
 * ":" indicates a variable(dynamic) path like when we type product/:productId,      *
 *  it means any thing after product/1234                                            *
 * it will not look at static(fix) path like normal route                            *
 * ********************************************************************************* *
 * If you have specific route and dynamic route together, remember that node         *
 *  will treat routes as top to bottom so make sure to keep specified route at top,  *
 *  otherwise it is unable to reach it....  router.get('/products/delete');          *
**************************************************************************************/
router.get('/products/:productId', shopController.getProduct);

// router.get("/orders", shopController.getOrders);

router.post('/create-order', shopController.postOrders);

router.get("/checkout", shopController.getCheckout);

router.post("/cart-delete-item", shopController.postCartDelete)


module.exports = router;
