const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,         // this only there for requested reset email token verification
  restTokenExpiration: Date,  // this only there for requested reset email token verification
  cart: {
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

// this is my own method work with mongoose
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    // cart: { items: [{product: prodcutId and this ref to entire product doc, quantity: value}] }
    // cp.product means the productId
    return cp.product.toString() === product._id.toString();
  });
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    this.cart.items[cartProductIndex].quantity += 1;
  } else {
    updatedCartItems.push({
      product: product._id, // product._id will auto-convert to ObjectId by mongoose
      quantity: 1,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save(); // save() is built-in method in mongoose
};

userSchema.methods.deleteItemFromCart = function (productId) {
  // cart: { items: [{product: prodcutId and this ref to entire product doc, quantity: value}] }
  // cartItem.product means the productId
  const updatedCartItem = this.cart.items.filter(cartItem => {
    return cartItem.product.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItem;
  return this.save(); // save() is built-in method in mongoose
};

userSchema.methods.clearCart = function () {
  this.cart = {items: []};
  return this.save();
}

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");

// // 3rd party libraries
// const getDb = require("../utils/database").getDb;

// class User {
//   constructor(username, email, cart, _id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items: [products]}
//     this._id = _id;
//   }

//   save() {
//     const db = getDb(); // get database attached to node appication
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then(result => {
//         //console.log(result);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }

//   addOrder() {
//     const db = getDb(); // get database attached to node appication
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] }; // remove from user object
//         return db.collection("users").updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } } // remove from database
//         );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this._id) })
//       .toArray()
//       .then(orders => {
//         return orders;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   deleteItemFromCart(prodId) {
//     const updatedCartItem = this.cart.items.filter(cartItem => {
//       return cartItem.productId.toString() !== prodId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItem } } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   static findById(userId) {
//     const db = getDb(); // get database attached to node appication
//     return db
//       .collection("users")
//       .find({ _id: mongodb.ObjectID(userId) })
//       .next()
//       .then(user => {
//         console.log("User Found!");
//         return user;
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }
// }

// module.exports = User;
