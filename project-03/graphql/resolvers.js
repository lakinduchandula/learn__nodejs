const User = require("../models/user");

const bcrypt = require("bcryptjs");
const validator = require("validator");

module.exports = {
  createUser({ userInput }, req) {
    const errors = []; // array will hold the errors

    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Email is invalid!" });
    }
    if (!validator.isLength(userInput.password, { min: 5 })) {
      errors.push({ message: "Password must be at least 5 characters!" });
    }
    if (errors.length > 0) {
      const error = new Error("Input validation failed!");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    return User.findOne({ email: userInput.email })
      .then(user => {
        if (user) {
          const error = new Error("Can't find the user!");
          throw error;
        }
        return bcrypt.hash(userInput.password, 12);
      })
      .then(encryptedPassword => {
        const user = new User({
          email: userInput.email,
          name: userInput.name,
          password: encryptedPassword,
        });
        return user.save();
      })
      .then(createdUser => {
        return { ...createdUser._doc, id: createdUser._id.toString() };
      })
      .catch(err => {
        console.log(err);
      });
  },
};
