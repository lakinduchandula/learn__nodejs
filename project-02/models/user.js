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
        //console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
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
