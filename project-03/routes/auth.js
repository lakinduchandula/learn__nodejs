const express = require("express");
const { body } = require("express-validator");

//** import model
const User = require("../models/user");

//* import middlewhere
const isAuth = require("../middleware/auth");

//** import controllers
const authController = require("../controllers/auth");

const router = express.Router();

router.get('/status', isAuth, authController.getUserStatus);

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
            return Promise.reject("E-Mail address already exists!");
          }
        });
      }),
    body("password").isLength({ min: 5, max: 12 }).trim(),
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
