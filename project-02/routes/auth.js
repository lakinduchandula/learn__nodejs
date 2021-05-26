const express = require("express");

const authController = require("../controllers/auth");

const routes = express.Router();

router.get("/login", authController.getLogin);

module.exports = routes;
