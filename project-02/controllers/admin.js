//3rd party libraries
const Product = require("../models/product");

// export this get method add product middleware func
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

// export this post method add product middleware func
exports.postAddProduct = (req, res, next) => {
  // extract the data from request.body
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

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
        isAuthenticated: req.session.isLoggedIn,
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

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log("Product Updated!");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByIdAndRemove(productId) // findByIdAndRemoved is mongoose method
    .then(result => {
      console.log("Product Deleted!");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => {
      console.log(err);
    });
};
