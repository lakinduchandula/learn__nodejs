const Product = require("../models/product");

// export this get methods shop product middleware func
exports.getProducts = (req, res, next) => {
  // directly call to static func through class name Product
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

// Index Page Controller
exports.getIndex = (req, res, next) => {
  /** FOR NOW PRODUCT LIST = INDEX PAGES **/

  // directly call to static func through class name Product
  Product.fetchAll(products => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

// Cart Page Controller
exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
  });
};

// Order Page Controller
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

// Checkout Page Controller
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
