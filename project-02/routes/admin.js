const path = require('path');
const express = require("express");

const router = express.Router();

// we can put get, post method insted of use after app. ,
// reach under /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

// app.post mean it will only run under post method
// reach under /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
