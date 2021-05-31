const express = require("express");

/******************************* NOTE **********************************
 * { check } <= this is destructuring; it means that this can pull out *
 * specific functions from required package 'express-validator/check'  *
 ***********************************************************************/
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const routes = express.Router();

routes.get("/login", authController.getLogin);

routes.post("/login", authController.postLogin);

routes.post("/logout", authController.postLogout);

routes.get("/signup", authController.getSignup);

routes.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Email is not valid"),
    body("password")
      .isLength({ min: 5, max: 12 })
      .withMessage("Password must be long at least 5 characters")
  ],
  authController.postSignup
);

routes.get("/reset", authController.getReset);

routes.get("/reset/:token", authController.getNewPassword);

routes.post("/reset", authController.postReset);

routes.post("/new-password", authController.postNewPassword);

module.exports = routes;
