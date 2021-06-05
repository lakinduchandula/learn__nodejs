const { validationResult } = require("express-validator");

// import models
const Post = require("../models/feed");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: "Find post successfully!",
        posts: posts,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // throw err; <= this code must fail because it is inside of asynchronous function
      next(err); // this will work with the err
    });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const errors = validationResult(req); // this will catch all the errors caught by routering file

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed! at createPost");
    error.statusCode = 422;
    throw error;
  }

  // create post in database
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/sample.png",
    creator: {
      name: "test@lakinduchandula.com",
    },
  });

  post
    .save()
    .then(result => {
      console.log("New Feed Created!", result);
      res.status(201).json({
        message: "Created post successfully!",
        post: result,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // throw err; <= this code must fail because it is inside of asynchronous function
      next(err); // this will work with the err
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Not Found Post for that postId!");
        error.statusCode = 404;
        throw err; // this will work because after this have a catch block insted of then block
      }

      res.status(200).json({ message: "Post Found!", post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // this will work with the err
    });
};
