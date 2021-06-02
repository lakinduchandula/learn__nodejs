const fs = require("fs");
const path = require("path");

//** 3rd party package
const PDFDocuments = require("pdfkit");

//** import from models
const Product = require("../models/product");
const Order = require("../models/order");

//*** constants
const ITEMS_PER_PAGE = 4;

// export this get methods shop product middleware func
exports.getProducts = (req, res, next) => {
  // directly call to static func through class name Product
  /*************************************** NOTE *************************************
   * find() method is inside of mongoose so it will give all product but it didn't  *
   * give the cursor back, but if we nedd .cursor() we can use .next() as well      *
   **********************************************************************************/
  Product.find()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Index Page Controller
exports.getIndex = (req, res, next) => {
  const page = req.query.page;

  Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // console.log(error);
    });
};

exports.getProduct = (req, res, next) => {
  /********************************************** NOTE *****************************************************
   * findById() method is inside of mongoose, we can pass string to it, it will convert to a ObjectId auto *
   * req.params can access the dynamic content after /products/:productId had,                             *
   * but in here very essential to same the name after : (productId) and the req.params (productId).       *
   *********************************************************************************************************/
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        path: "/products", // which navigation should highlight
        pageTitle: product.title, // which page title should display
        product: product, // passing product arry to the shop/product-detail.ejs file
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // console.log(error);
    });
};

// Cart Page Controller
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.product") // this will specifically return the prod doc
    .execPopulate() // populate not return promise by default therefore -> execPopulate
    .then(user => {
      const products = user.cart.items;
      // console.log('getCART products ==>' , user.cart.items)
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // console.log(error);
    });
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // console.log(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      //console.log(result);
      res.redirect("/cart");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Order Page Controller
exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // console.log(error);
    });
};

// post orders
exports.postOrders = (req, res, next) => {
  req.user
    .populate("cart.items.product") // this will specifically return the prod doc
    .execPopulate() // populate not return promise by default therefore -> execPopulate
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.product._doc } };
      });
      const order = new Order({
        products: products,
        user: {
          userId: req.user,
          name: req.user.name,
        },
      });
      order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // console.log(error);
    });
};

// Checkout Page Controller
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
    // isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = "invoice-" + orderId + ".pdf";
  const invoicePath = path.join("data", "invoices", invoiceName);

  // check this user belongs to this invoice
  Order.findById(orderId).then(order => {
    if (!order) {
      return next(new Error("No such Order in Database!"));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("User doesn't belongs to this invoice!"));
    }
    /****************** NOT GOOD FOR LARGE FILES EAT THE MEMORY FOR MORE REQ ************************/
    /************************************************************************************************
     * fs.readFile(invoicePath, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename=" ' + invoiceName + ' " '
      );
      res.send(data);
       });
    *************************************************************************************************/
    const OrderPDF = new PDFDocuments();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename=" ' + invoiceName + ' " '
    );
    OrderPDF.pipe(fs.createWriteStream(invoicePath));
    OrderPDF.pipe(res);

    OrderPDF.fontSize(16).text(
      "-----------------------------------  INVOICE  -----------------------------------"
    );

    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice += prod.quantity * prod.product.price;
      OrderPDF.fontSize(12).text(
        prod.product.title +
          "                                             " +
          prod.quantity +
          " x " +
          "$" +
          prod.product.price
      );
    });

    OrderPDF.text("  ");
    OrderPDF.text("  ");
    OrderPDF.text("  ");
    OrderPDF.text(
      "------------------------------------------------------------------------------------------------------------------"
    );
    OrderPDF.fontSize(14).text("Total Price: $" + totalPrice);
    OrderPDF.text("  ");
    OrderPDF.fontSize(16).text(
      "------------------------------- END OF INVOICE -----------------------------"
    );

    OrderPDF.end(); // done writeing file will save

    /**************************************************************************************************
     * const file = fs.createReadStream(invoicePath);
       res.setHeader("Content-Type", "application/pdf");
       res.setHeader(
        "Content-Disposition",
        'inline; filename=" ' + invoiceName + ' " '
      );
      file.pipe(res);
    ***************************************************************************************************/
  });
};
