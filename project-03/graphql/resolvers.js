const User = require("../models/user");

const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

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
  login({ email, password }) {
    let loadUser;
    return User.findOne({ email: email })
      .then(user => {
        if (!user) {
          const error = new Error("Can't find the user!");
          error.code = 401;
          throw error;
        }
        loadUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then(isMatch => {
        if (!isMatch) {
          const error = new Error("Password mismatch!");
          error.code = 401;
          throw error;
        }
        // console.log("user authenticated!", loadUser);
        const token = jwt.sign(
          {
            email: loadUser.email,
            userId: loadUser._id.toString(),
          },
          "lakinduchandulalakinduchadandula",
          { expiresIn: "1h" }
        );
        return { token: token, userId: loadUser._id.toString() };
      })
      .catch(err => {
        console.log(err);
      });
  },
};
