const bcryptjs = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("60aca09b101bd941fcaf5e84")
    .then(user => {
      req.session.isLoggedIn = true;
      console.log("Authenticated!");
      req.session.user = user;
      req.session.save(err => {
        // executes when done save
        console.log(err);
        res.redirect("/");
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return bcryptjs
        .hash(password, 12)
        .then(encryptedPassword => {
          const newUser = new User({
            email: email,
            password: encryptedPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then(result => {
          console.log("<<<  == New User Created! ==  >>>");
          res.redirect("/login");
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    // arrow fucntion declare what happen when done destroy the session
    console.log(err);
    res.redirect("/");
  });
};
