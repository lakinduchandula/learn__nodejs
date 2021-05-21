const fs = require("fs");
const path = require("path");

// this will give the location globally
const location = path.join(
  path.dirname(require.main.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch the product from file using id
    fs.readFile(location, (err, fileContent) => {
      // structure of cart
      let cart = { products: [], totalPrice: 0 };

      // check the file content is exsist
      if (!err) {
        // read the cart
        cart = JSON.parse(fileContent);
      }
      // analyze the cart and get the specified product
      const existingProductIndex = cart.products.findIndex(
        product => product.id == id
      );
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct; // existing product going to updated

      // check whether specified product is already exists or not
      if (existingProduct) {
        // already exists
        console.log("line 34 - existingProduct ", existingProduct);
        //updatedProduct = { ...existingProduct }; <- CANT UNDERSTAND WHY THIS LINE; NO USEFUL TO ME
        updatedProduct = existingProduct;
        console.log("line 36 - updatedProduct ", updatedProduct);
        updatedProduct.qty += 1; // increment the quantity by 1

        //update the cart by making changes
        //cart.products = [...cart.products]; <- CANT UNDERSTAND WHY THIS LINE; NO USEFUL TO ME
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // not already exists
        // new to cart
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      // update the total price
      // update the total price "+" will typecasting text to number
      cart.totalPrice += +productPrice;
      fs.writeFile(location, JSON.stringify(cart), err => {
        if (err) console.log(err);
      });
    });
  }
};
