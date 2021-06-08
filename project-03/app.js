const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const { nanoid } = require("nanoid");

//* import graphql
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const { graphqlHTTP } = require("express-graphql");
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, nanoid(10) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.originalError.message || "An Error Occurred";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use(express.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*"); // this allow to setHeaders from every domain
//   res.setHeader(
//     // this is about what methods that can used by the clients
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH" // examples which methods can use to connect with end points
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // what headers can set by the client
//   next(); // we have pass the req to next middlwhere
// });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://online-shop-node-application:6C65rHM7bQbxsPPn@cluster0.fjhfb.mongodb.net/chat",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    console.log(" = Connected to Monogodb Atlas! =");
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
