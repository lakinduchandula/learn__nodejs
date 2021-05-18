const path = require('path');

// 3rd party libraries
const express = require("express");

// custom (my own) libraries
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express(); // this express will handle almost very thing in behind the scenes

app.use(express.urlencoded({ // this will help to catch the body in express package
  extended: true
}));

// this middleware function will give the access to the user to read our file system in public folder
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/admin', adminData.routes); // handling all admin routes
app.use(shopRoutes); // handling all shop routes

app.use((req, res, next) => { // this will handle all the undefined routes
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.listen(3000); // this will do both creating server and listen on port 3000
