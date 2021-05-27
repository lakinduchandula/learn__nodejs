const path = require("path");

// 3rd party libraries
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); // pass the argument to fucntion

// custom (my own) libraries
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

// constants
const MONGODB_URI =
  "mongodb+srv://lakinduchandula:befUUaXreUAbXmSb@cluster0.fjhfb.mongodb.net/shop"; 

// import controllers
const pageNotFoundController = require("./controllers/404");

const app = express(); // this express will handle almost very thing in behind the scenes
const store = new MongoDBStore({
  uri: MONGODB_URI, // uri mongodb
  collection: "sessions", // which collection to store sessions
});

app.set("view engine", "ejs"); // this will setup ejs as the template engine

// this will setup where temp file in,
//if temp file are is some where besides views folder second argument should replace by that folder name
app.set("views", "views");

app.use(
  express.urlencoded({
    // this will help to catch the body in express package
    extended: true,
  })
);

// session middleware
app.use(
  session({
    secret: "long-string-in-prodction-level!", // this will normaly a long string
    resave: false, // not save for every incoming req or res that we send, unless content is not changed
    saveUninitialized: false, // this will also basically give the same meaning as resave
    store: store, // MongoDBStore variable (store)
  })
);

app.use((req, res, next) => {
  User.findById("60aca09b101bd941fcaf5e84")
    .then(user => {
      req.user = user; // add the user to request so we can access it any where
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

// this middleware function will give the access to the user to read our file system in public folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes); // handling all admin routes
app.use(shopRoutes); // handling all shop routes
app.use(authRoutes); // handling all auth routes

app.use(pageNotFoundController.NotFoundPage);

mongoose
  .connect(
    MONGODB_URI, // srv string to connect mongodb atlas
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(response => {
    User.findOne().then(user => {
      if (!user) {
        // create a user
        const user = new User({
          name: "lakinduchandula",
          email: "lakinduchandula@test.lk",
          cart: { items: [] },
        });
        user.save(); // save the user
      }
    });
    // mongodb connected msg
    console.log("Connected to Mongodb Atlas!");
    // setup the server to listen on port 3000
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
