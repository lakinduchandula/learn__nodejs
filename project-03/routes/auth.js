const express = require("express");
const { body } = require("express-validator");

//** import model
const User = require("../models/user");

//** import controllers
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Not a valid email")
      .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false })
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("Email is already taken!");
          }
        });
      }),
    body("password").isLength({ min: 5, max: 12 }).trim(),
  ],
  authController.signup
);

module.exports = router;
