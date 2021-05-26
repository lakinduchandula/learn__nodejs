const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String, // data type of title
    require: true, // true means we must insert title for every product
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    require: true, 
  }
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require("mongodb");

// // 3rd party custom libraries
// const getDb = require("../utils/database").getDb;

// class Product {
//   constructor(title, imageUrl, description, price, _id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//     this._id = _id ;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb(); // get database attached to node appication
//     let dbOp ; // set the database operation

//     // check whether this._id is exist or not and make the decision update or
//     // insert new product to the database
//     if (this._id) {
//       /** this line we can mention all the attributes insted of "this" **/
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
//     } else {
//       dbOp = db
//         .collection("products") //  make collection to save data
//         .insertOne(this); // inserting the object
//     }
//     return dbOp
//       .then(result => {
//         console.log(result); // run if process succeeded
//       })
//       .catch(err => {
//         console.log(err); // run if any error
//       });
//   }

//   static fetchAll() {
//     /*****************************************************************************
//      * find() will give all documents not at once by document by document        *
//      * because sometimes it can be have millions of documents in the collection, *
//      * so sending all data through wire at once is not a good practice           *
//      *****************************************************************************/
//     const db = getDb(); // get database attached to node appication
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then(products => {
//         return products;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static findById(id) {
//     const db = getDb(); // get database attached to node appication
//     return db
//       .collection("products")
//       .find({ _id: mongodb.ObjectID(id) })
//       .next()
//       .then(product => {
//         return product;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static deleteById(id) {
//     const db = getDb(); // get database attached to node appication
//     return db
//       .collection("products")
//       .deleteOne({ _id: mongodb.ObjectID(id) })
//       .then()
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }

// module.exports = Product;
