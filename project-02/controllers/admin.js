//3rd party libraries
const Product = require("../models/product");

const { validationResult } = require("express-validator");

// export this get method add product middleware func
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: [],
    // isAuthenticated: req.session.isLoggedIn,
  });
};

// export this post method add product middleware func
exports.postAddProduct = (req, res, next) => {
  // extract the data from request.body
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;

  // check if the file is an image or other format if other format image will be undefined
  if (!image) {
    console.log("I came!")
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        description: description,
        price: price,
      },
      errorMessage: ['Not an Image file!'],
    });
  }

  console.log(image);

  // pass all errors to req and check if there are any errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error([errors.array()[0].msg]);
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: image,
        description: description,
        price: price,
      },
      errorMessage: [errors.array()[0].msg],
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    // object will be a reference to the productSchema
    title: title,
    description: description,
    price: price,
    imageUrl: imageUrl,
    userId: req.user, // we stored user in request mongoose will only get _id when we send the entire user model
  });
  product
    .save() // save method is already built inside mongoose
    .then(result => {
      console.log("Product Created!");
      res.redirect("/admin/products");
    })
    .catch(err => {
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  /************************************ QUERY PARAMETER *************************************
   * express manage a method of request call query (req.query), using this we can access    *
   * extra value by separated by & after address by ?                                       *
   * /edit-product/12345?edit=true&title=new like this, key value pairs                     *
   * we can access them using key and req.query.KEY  (type is string | true => "true")      *
   ******************************************************************************************/
  const editMode = req.query.edit;
  const productId = req.params.productId;
  if (!editMode) {
    return res.redirect("/");
  }
  Product.findById(productId)
    .then(product => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasErr: false,
        errorMessage: [],
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
      console.log(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId; // get prodId from hidden input

  // extract the data from request.body
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;

  // pass all errors to req and check if there are any errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error([errors.array()[0].msg]);
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        description: updatedDescription,
        price: updatedPrice,
        _id: prodId,
      },
      errorMessage: [errors.array()[0].msg],
    });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;

      // check if there is image exsist
      if(image) {
        product.imageUrl = image.path;
      }
      return product.save().then(result => {
        console.log("Product Updated!");
        res.redirect("/admin/products");
      });
    })
    .catch(err => {
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
      console.log(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id }) // findByIdAndRemoved is mongoose method
    .then(result => {
      console.log("Product Deleted!");
      res.redirect("/admin/products");
    })
    .catch(err => {
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
      console.log(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    /*************************************** SIDE NOTE ********************************************
     * through -> .select() this will allow us to which filed that we need to select or unselect  *
     * through -> populate() this will allow us to fetch specified data                           *
     * select can control the fileds of main and populated documents also..                       *
     **********************************************************************************************/
    //.select('title price -_id') // need title and price but not need _id so pit - infront field name
    //.populate('userId', 'name') // write the filed name inside 'field name'
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      // const error = new Error(err);
      // error.httpStatusCode = 500;
      // return next(error);
      console.log(error);
    });
};
