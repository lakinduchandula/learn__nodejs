const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

// import models
const Post = require("../models/post");
const User = require("../models/user");


exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  let totalItems;
  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res.status(200).json({
        message: "Find post successfully!",
        posts: posts,
        totalItems: totalItems,
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

  let creator;

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed! at createPost");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("File is not found!");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path.replace("\\", "/");
 
  // create post in database
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });

  post
    .save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.posts.push(post);
      creator = user;
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Created post successfully!",
        post: post,
        creator: { _id: creator._id, name: creator.name },
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;

  let imageUrl = req.body.image;

  if (req.file) {
    // check update the file or not
    imageUrl = req.file.path.replace("\\", "/");
  }

  if (!imageUrl) {
    // this is little bit optional
    const error = new Error("No file found!");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Not Found Post for that postId!");
        error.statusCode = 404;
        next(err);
      }
      // console.log('UserId =====> ',req.userId)
      if (post.creator.toString() !== req.userId) {
        const error = new Error("User is not allow to update is post!");
        error.statusCode = 403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(result => {
      res
        .status(200)
        .json({ message: "Post Updated Successfully!", post: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // this will work with the err
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, err => {
    if (err) {
      console.log("Error => ", err);
    }
  });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Post is not found in database");
        error.statusCode = 422;
        next(error);
      }
      if (post.creator.toString() !== req.userId.toString()) {
        const error = new Error("User is not allow to update is post!");
        error.statusCode = 403;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(result => {
      // console.log(result);
      res.status(200).json({ message: "Post deleted successfully!" });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // this will work with the err
    });
};
