const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "projects.lakinduchandula@outlook.com", // generated ethereal user
    pass: "testing@123", // generated ethereal password
  },
})

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: req.flash("Error-Invalid Credentials"),
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: req.flash("Error-Registerd Credentials"),
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        // send the feedback to user
        req.flash(
          "Error-Invalid Credentials",
          "Invalid Credentials please try again!"
        );
        return res.redirect("/login");
      }
      bcryptjs
        .compare(password, user.password) // 1st argument is the password, 2nd is hashed value
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            console.log("Authenticated!");
            req.session.user = user;
            return req.session.save(err => {
              // executes when done save
              console.log(err);
              res.redirect("/");
            });
          }
          // send the feedback to user
          req.flash(
            "Error-Invalid Credentials",
            "Invalid Password please try again!"
          );
          res.redirect("/login");
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
        req.flash(
          "Error-Registerd Credentials",
          "Email that you've entered is already taken! Signup with different one."
        );
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
          return transporter.sendMail({
            from: '"Admin 👻" <projects.lakinduchandula@outlook.com>', // sender address
            to: email, // list of receivers
            subject: "Signup Success ✔", // Subject line
            text: "Signup Succeed!", // plain text body
            html: "<p>You are successfully signed up and enjoy shopping!</p>", // html body
          });
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
