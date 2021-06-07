const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const { nanoid } = require("nanoid");

const app = express();

const feedRouter = require("./routes/feed");
const authRouter = require("./routes/auth");

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

app.use("/feed", feedRouter);
app.use("/auth", authRouter);

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
    console.log("Connected to Monogodb Atlas!");
    const server = app.listen(8080);
    const io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true,
      },
      allowEIO3: true,
    });
    io.on("connection", socket => {
      console.log("Clinet Connected!");
    });
  })
  .catch(err => {
    console.log(err);
  });
