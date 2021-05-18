const path = require('path');
const express = require("express");

// custom libraries
const adminData = require('./admin');

const router = express.Router();

router.get("/", (req, res, next) => {
    console.log('shop.js' ,adminData.products)
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = router;
