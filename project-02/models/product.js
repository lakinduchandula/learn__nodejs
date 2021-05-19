const fs = require("fs");
const path = require("path");

module.exports = class Product {
  // constructor in the class
  constructor(title) {
    this.title = title;
  }

  save() {
    //  this method will save products
    const location = path.join(
      path.dirname(require.main.filename),
      "data",
      "products.json"
    );

    fs.readFile(location, (err, fileContent) => {
      let products = []; // this will contian the fileContent
      if (!err) {
        // if this true that means fileContent data
        products = JSON.parse(fileContent); //  read fileContent
      }
      // if there is no fileContent, then push newly added data to array
      products.push(this);

      // this will get the javascript object and convert it to JSON
      // and write it into the path(location),
      fs.writeFile(location, JSON.stringify(products), err => {
        if (err) {
          console.log(err); // this will run if it is only err
        }
      });
    });
  }

  // this static method can be directly call through class name(Product)
  // without instantiate object
  static fetchAll(cb) { // we are using callback because of evet driven architecture
    const location = path.join(
      path.dirname(require.main.filename),
      "data",
      "products.json"
    );

    fs.readFile(location, (err, fileContent) => {
      if (err) {
        cb([]); // return if empty in products.json
      }
      cb(JSON.parse(fileContent)); // this will return when product.json have a content
    });
  }
};
