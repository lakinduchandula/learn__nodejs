const path = require('path');

// 3rd party libraries
const express = require("express");

// custom (my own) libraries
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express(); // this express will handle almost very thing in behind the scenes

app.set('view engine', 'ejs'); // this will setup ejs as the template engine

// this will setup where temp file in, 
//if temp file are is some where besides views folder second argument should replace by that folder name
app.set('views', 'views');  


app.use(express.urlencoded({ // this will help to catch the body in express package
  extended: true
}));

// this middleware function will give the access to the user to read our file system in public folder
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/admin', adminRoutes); // handling all admin routes
app.use(shopRoutes); // handling all shop routes

app.use((req, res, next) => { // this will handle all the undefined routes
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: req.path });
})

app.listen(3000); // this will do both creating server and listen on port 3000
