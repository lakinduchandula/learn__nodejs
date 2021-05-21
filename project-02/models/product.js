const fs = require("fs");
const path = require("path");

// 3rd party libraries (custom lib)
const Cart = require('./cart');

// this will give the location globally
const location = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

// this will read the file
const getProductsFromFile = cb => {
  fs.readFile(location, (err, fileContent) => {
    if (err) {
      cb([]); // return if empty in products.json
    }
    cb(JSON.parse(fileContent)); // this will return when product.json have a content
  });
};

module.exports = class Product {
  // constructor in the class
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    //  this method will save products
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(location, JSON.stringify(updatedProducts), err => {
          if (err) console.log(err); // this will run if it is only err
        });
      } else {
        // assing a unique ID to every saved product
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(location, JSON.stringify(products), err => {
          if (err) console.log(err); // this will run if it is only err
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      // searching the product before deleted
      const product = products.find(prod => prod.id === id);

      /**** products.filter will throw all the match item according to the logic
       (prod.id !== id) and put into a new array ****/
      const updatedProducts = products.filter(prod => prod.id !== id);

      fs.writeFile(location, JSON.stringify(updatedProducts), err => {
        if (!err) Cart.deleteProduct(id, product.price); // this will run if no err
      });
    });
  }

  // this static method can be directly call through class name(Product)
  // without instantiate object
  static fetchAll(cb) {
    // we are using callback because of evet driven architecture
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id == id);
      cb(product);
    });
  }
};
