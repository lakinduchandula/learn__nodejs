const mongodb = require("mongodb");

// 3rd party libraries
const getDb = require("../utils/database").getDb;

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
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