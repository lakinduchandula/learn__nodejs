const express = require("express");
const { body } = require("express-validator");

//* import middlewhere
const isAuth = require("../middleware/auth");

const router = express.Router();

const feedController = require("../controllers/feed");

// GET => /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  isAuth,
  feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  isAuth,
  feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
