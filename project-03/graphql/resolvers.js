//** import models
const User = require("../models/user");
const Post = require("../models/post");

//** import third party packages
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser({ userInput }, req) {
    const errors = []; // array will hold the errors

    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Email is invalid!" });
    }
    if (!validator.isLength(userInput.password, { min: 5 })) {
      errors.push({ message: "Password must be at least 5 characters!" });
    }
    if (errors.length > 0) {
      const error = new Error("Input validation failed!");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    return User.findOne({ email: userInput.email })
      .then(user => {
        if (user) {
          const error = new Error("Can't find the user!");
          throw error;
        }
        return bcrypt.hash(userInput.password, 12);
      })
      .then(encryptedPassword => {
        const user = new User({
          email: userInput.email,
          name: userInput.name,
          password: encryptedPassword,
        });
        return user.save();
      })
      .then(createdUser => {
        return { ...createdUser._doc, id: createdUser._id.toString() };
      })
      .catch(err => {
        console.log(err);
      });
  },
  login({ email, password }) {
    let loadUser;
    return User.findOne({ email: email })
      .then(user => {
        if (!user) {
          const error = new Error("Can't find the user!");
          error.code = 401;
          throw error;
        }
        loadUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then(isMatch => {
        if (!isMatch) {
          const error = new Error("Password mismatch!");
          error.code = 401;
          throw error;
        }
        // console.log("user authenticated!", loadUser);
        const token = jwt.sign(
          {
            email: loadUser.email,
            userId: loadUser._id.toString(),
          },
          "lakinduchandulalakinduchadandula",
          { expiresIn: "1h" }
        );
        return { token: token, userId: loadUser._id.toString() };
      })
      .catch(err => {
        console.log(err);
      });
  },
  createPost({ postInput }, req) {
    let loadUser;
    if (!req.isAuth) {
      const error = new Error("Not an Authorized User!");
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid!" });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid!" });
    }
    if (errors.length > 0) {
      const error = new Error("Input validation failed!");
      error.data = errors;
      error.code = 422;
      throw error;
    } // after this if check req can create a valid post

    // get the user data from request
    return User.findById(req.userId)
      .then(user => {
        if (!user) {
          const error = new Error("User not found!");
          error.code = 401;
          throw error;
        }
        loadUser = user;
        // create a post
        const post = new Post({
          title: postInput.title,
          content: postInput.content,
          imageUrl: postInput.imageUrl,
          creator: loadUser,
        });
        return post.save();
      })
      .then(createdPost => {
        loadUser.posts.push(createdPost);
        loadUser.save();
        return {
          ...createdPost._doc,
          id: createdPost._id.toString(),
          createdAt: createdPost.createdAt.toISOString(),
          updatedAt: createdPost.updatedAt.toISOString(),
        };
      })
      .catch(err => {
        console.log(err);
      });
  },
  posts({ page }, req) {
    // check if user authenticated
    if (!req.isAuth) {
      const error = new Error("Not an Authorized User!");
      error.code = 401;
      throw error;
    }
    if (!page) {
      page = 1;
    }
    // declare variable for total posts
    let totalPosts;
    const perPage = 3;

    return Post.find()
      .countDocuments()
      .then(count => {
        totalPosts = count;
        return Post.find()
          .sort({ createdAt: -1 })
          .skip((page - 1) * perPage)
          .limit(perPage)
          .populate("creator");
      })
      .then(posts => {
        return {
          posts: posts.map(post => {
            return {
              ...post._doc,
              _id: post._id.toString(),
              createdAt: post.createdAt.toISOString(),
              updatedAt: post.updatedAt.toISOString(),
            };
          }),
          totalPosts: totalPosts,
        };
      })
      .catch(err => {
        console.log(err);
      });
  },
};
