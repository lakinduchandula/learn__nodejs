const fs = require("fs");
const path = require("path");

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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    //  this method will save products
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(location, JSON.stringify(products), err => {
        if (err) console.log(err); // this will run if it is only err
      });
    });
  }

  // this static method can be directly call through class name(Product)
  // without instantiate object
  static fetchAll(cb) {
    // we are using callback because of evet driven architecture
    getProductsFromFile(cb);
  }
};
