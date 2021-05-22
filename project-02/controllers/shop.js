const Product = require("../models/product");
const Cart = require("../models/cart");

// export this get methods shop product middleware func
exports.getProducts = (req, res, next) => {
  // directly call to static func through class name Product
  Product.fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// Index Page Controller
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  /********************************************** NOTE ***************************************************
   * req.params can access the dynamic content after /products/:productId had,                           *
   *  but in here very essential to same the name after : (productId) and the req.params (productId).    *
   *******************************************************************************************************/
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      console.log(product);
      res.render("shop/product-detail", {
        path: "/products", // which navigation should highlight
        pageTitle: product.title, // which page title should display
        product: product, // passing product arry to the shop/product-detail.ejs file
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// Cart Page Controller
exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    // to store the product in cart
    const cartProducts = [];
    Product.fetchAll(products => {
      for (product of products) {
        const cartProductsData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductsData) {
          cartProducts.push({
            productData: product,
            qty: cartProductsData.qty,
          });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
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
