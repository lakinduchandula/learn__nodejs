const Product = require("../models/product");

// export this get method add product middleware func
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

// export this post method add product middleware func
exports.postAddProduct = (req, res, next) => {
  // extract the data from request.body
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;

  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  /************************************ QUERY PARAMETER *************************************
   * express manage a method of request call query (req.query), using this we can access    *
   * extra value by separated by & after address by ?                                       *
   * /edit-product/12345?edit=true&title=new like this, key value pairs                     *
   * we can access them using key and req.query.KEY  (type is string | true => "true")      *
   ******************************************************************************************/
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: editMode,
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
