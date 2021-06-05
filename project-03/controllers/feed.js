const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "25864",
        title: "First Post",
        content: "This is the first post",
        imageUrl: "images/sample.png",
        creator: {
          name: "lakinduchandula",
        },
        createdAt: Date.now(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const errors = validationResult(req); // this will catch all the errors caught by routering file

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation Failed!", errors: errors.array() });
  }

  // create post in database
  console.log("API Called!");

  res.status(201).json({
    message: "Created post successfully!",
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: "test@lakinduchandula.com",
      },
      createdAt: Date.now(),
    },
  });
};
