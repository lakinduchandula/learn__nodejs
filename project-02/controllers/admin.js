const mongodb = require("mongodb");

//3rd party libraries
const Product = require("../models/product");

// export this get method add product middleware func
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

// export this post method add product middleware func
exports.postAddProduct = (req, res, next) => {
  // extract the data from request.body
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const product = new Product({ // object will be a reference to the productSchema
    title: title,
    description: description,
    price: price,
    imageUrl: imageUrl,
  });
  product
    .save() // save method is already built inside mongoose
    .then(result => {
      console.log("Product Created!");
      res.redirect("/admin/products");
    })
    .catch(err => {
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
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId; // get prodId from hidden input

  // extract the data from request.body
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;

  const product = new Product(
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice,
    new mongodb.ObjectId(prodId)
  );

  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
      console.log("Product Updated!");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
    .then(result => {
      console.log("Product Deleted!");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch(err => {
      console.log(err);
    });
};
