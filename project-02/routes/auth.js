const express = require("express");

/******************************* NOTE **********************************
 * { check } <= this is destructuring; it means that this can pull out *
 * specific functions from required package 'express-validator/check'  *
 ***********************************************************************/
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const User = require("../models/user");

const routes = express.Router();

routes.get("/login", authController.getLogin);

routes.post("/login", authController.postLogin);

routes.post("/logout", authController.postLogout);

routes.get("/signup", authController.getSignup);

routes.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Email is not valid")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              "Email that you've entered is already taken! Signup with different one."
            );
          }
        });
      }),
    body("password")
      .isLength({ min: 5, max: 12 })
      .withMessage("Password must be long at least 5 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords mismatch!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

routes.get("/reset", authController.getReset);

routes.get("/reset/:token", authController.getNewPassword);

routes.post("/reset", authController.postReset);

routes.post("/new-password", authController.postNewPassword);

module.exports = routes;
