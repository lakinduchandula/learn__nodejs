const User = require("../models/user");

const bcrypt = require("bcryptjs");

module.exports = {
  createUser({ userInput }, req) {
    // const email = args.userInput.email;
    const email = userInput.email;
    return User.findOne({ email: email })
      .then(user => {
        if (user) {
          const error = new Error("User not found in database!");
          next(error);
        }
        return bcrypt.hash(userInput.password, 12);
      })
      .then(encryptedPassword => {
        const user = new User({
          email: email,
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
