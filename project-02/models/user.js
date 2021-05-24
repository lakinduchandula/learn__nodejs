const mongodb = require("mongodb");

// 3rd party libraries
const getDb = require("../utils/database").getDb;

class User {
  constructor(username, email, cart, _id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: [products]}
    this._id = _id;
  }

  save() {
    const db = getDb(); // get database attached to node appication
    return db
      .collection("users")
      .insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  addToCart(product) {
    const db = getDb(); // get database attached to node appication
    // const cartProduct = this.cart.items.findIndex(cp => {
    //   cp._id === mongodb.ObjectId(product._id);
    // });

    // let's assume this is for a new cart and thereis no products in it
    const updatedCart = {
      items: [{ productId: new mongodb.ObjectId(product._id), quantity: 1 }],
    };
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: updatedCart } }
      )
      .then(() => {
        console.log("Cart Updated Successfuly!");
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(userId) {
    const db = getDb(); // get database attached to node appication
    return db
      .collection("users")
      .find({ _id: mongodb.ObjectID(userId) })
      .next()
      .then(user => {
        console.log("User Found!");
        return user;
      })
      .catch(error => {
        console.log(error);
      });
  }
}

module.exports = User;
