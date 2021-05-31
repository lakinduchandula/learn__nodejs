const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "projects.lakinduchandula@outlook.com", // generated ethereal user
    pass: "testing@123", // generated ethereal password
  },
});

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: req.flash("Error-Invalid Credentials"),
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: req.flash("Error-Registerd Credentials"),
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  // check any errors have
  if (!errors.isEmpty()) {
    // render the same page with validation error status code (422)
    console.log(errors.array());
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false,
      errorMessage: [errors.array()[0].msg],
      oldInput: {
        email: email,
        password: password,
      },
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          isAuthenticated: false,
          errorMessage: ['No user found for that email !'],
          oldInput: {
            email: email,
            password: password,
          },
        });
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
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            isAuthenticated: false,
            errorMessage: ['Invalid Password please try again !'],
            oldInput: {
              email: email,
              password: password,
            },
          });
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

  /* if any erros are encountered from that middleware that we add on auth(routes)
   file they will be stored at here and we can grab those errors */
  const errors = validationResult(req);

  // check any errors have
  if (!errors.isEmpty()) {
    // render the same page with validation error status code (422)
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      errorMessage: [errors.array()[0].msg],
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    });
  }

  bcryptjs
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

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: req.flash("Error-Reset-Email-Not-Found"),
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }

    // 'hex' mean that value need to convert hex values to normal ascii characters
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash(
            "Error-Reset-Email-Not-Found",
            "No account found! for that Email"
          );
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.restTokenExpiration = Date.now() + 3600000; // 3600000 in miliseconds
        return user.save(); //  save the current state to db
      })
      .then(result => {
        if (result) {
          res.redirect("/");
          transporter.sendMail({
            from: '"Admin 👻" <projects.lakinduchandula@outlook.com>', // sender address
            to: req.body.email, // receiver
            subject: "Password Reset ❗️", // Subject line
            text: "You Request to reset the password you can do it by this following link", // plain text body
            html: `
              <p> Click this link for new password this will only valid for an hour by now </p>
              <a href="http://localhost:3000/reset/${token}">Click Here</a>
              <hr>
              <p> This email by admin </p>
              `, // html body
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, restTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (user) {
        res.render("auth/new-password", {
          path: "/new-password",
          pageTitle: "Reset Password",
          errorMessage: req.flash("error"),
          userId: user._id.toString(),
          passwordToken: token,
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const newPassword = req.body.password;
  let resetUser;
  let userMail;

  User.findOne({
    resetToken: passwordToken,
    restTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then(user => {
      resetUser = user;
      userMail = user.email;
      return bcryptjs.hash(newPassword, 12);
    })
    .then(encryptedPassword => {
      resetUser.password = encryptedPassword;
      resetUser.resetToken = undefined;
      resetUser.restTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect("/login");
      transporter.sendMail({
        from: '"Admin 👻" <projects.lakinduchandula@outlook.com>', // sender address
        to: userMail, // receiver
        subject: "Password Reset Successfully ✔", // Subject line
        text: "Your password has been successfully updated to a new one", // plain text body
        html: `
          <p> Click this link for login</p>
          <a href="http://localhost:3000/login">Click Here</a>
          <hr>
          <p> This email by admin </p>
          `, // html body
      });
    })
    .catch(err => {
      console.error(err);
    });
};
