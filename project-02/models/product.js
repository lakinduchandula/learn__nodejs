const mongodb = require('mongodb');

// 3rd party custom libraries
const getDb = require("../utils/database").getDb;

class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    const db = getDb(); // get database attached to node appication
    return db
      .collection("products") //  make collection to save data
      .insertOne(this) // inserting the object
      .then(result => {
        console.log(result); // run if process succeeded
      })
      .catch(err => {
        console.log(err); // run if any error
      });
  }

  static fetchAll() {
    /*****************************************************************************
     * find() will give all documents not at once by document by document        *
     * because sometimes it can be have millions of documents in the collection, *
     * so sending all data through wire at once is not a good practice           *
     *****************************************************************************/
    console.log("At Product model");
    const db = getDb(); // get database attached to node appication
    return db
      .collection("products")
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(id) {
    const db = getDb(); // get database attached to node appication
    return db
      .collection("products")
      .find({ _id: mongodb.ObjectID(id) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;
