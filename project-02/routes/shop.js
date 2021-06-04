const express = require("express");

// custom libraries
const shopController = require("../controllers/shop");
const isAuthenticated = require("../middleware/isAuth");

const router = express.Router();

/*************************************************************************************
 * "isAuthenticated", behaviour of get or post route is it work left to right,       *
 * when specific route called, it search left isAuthenticated middleware and see if  *
 * it is correct what it finding if it is not then go to the second middleware it    *
 * define (i.e. shopController.SOME_MIDDLEWARE), if we forget to mention next()      *
 * in some middleware (example in isAuthenticated) it means if route didn't match    *
 * it will die in that perticular middelware it means no pass to other middleware.   *
 **************************************************************************************/

// this will handle all added products
router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/cart", isAuthenticated, shopController.getCart);

router.post("/cart", isAuthenticated, shopController.postCart);

/******************************** THEORY *********************************************
 * ":" indicates a variable(dynamic) path like when we type product/:productId,      *
 *  it means any thing after product/1234                                            *
 * it will not look at static(fix) path like normal route                            *
 * ********************************************************************************* *
 * If you have specific route and dynamic route together, remember that node         *
 *  will treat routes as top to bottom so make sure to keep specified route at top,  *
 *  otherwise it is unable to reach it....  router.get('/products/delete');          *
 **************************************************************************************/
router.get("/products/:productId", shopController.getProduct);

router.get("/orders", isAuthenticated, shopController.getOrders);

router.get("/orders/:orderId", isAuthenticated, shopController.getInvoice);

// router.post("/create-order", isAuthenticated, shopController.postOrders);

router.get("/checkout", isAuthenticated, shopController.getCheckout);

router.get("/checkout/success", isAuthenticated, shopController.getCheckoutSuccess);

router.get("/checkout/cancel", isAuthenticated, shopController.getCheckout);

router.post(
  "/cart-delete-item",
  isAuthenticated,
  shopController.postCartDelete
);

module.exports = router;
