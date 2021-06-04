exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "First Post", content: "This is the first post" }],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  // create post in database

  res
    .status(201)
    .json({
      message: "Created post successfully!",
      post: { id: new Date().toISOString(), title: title, content: content },
    });
};

/******************************** CLIENT CODE (HTML) ****************************************************************
    <button id="get">Get Post</button>
    <button id="post">Create a Post</button>
*********************************************************************************************************************
**********************************CLIENT CODE (JS) ******************************************************************
const getButton = document.getElementById('get');
const postButton = document.getElementById('post');

getButton.addEventListener('click', () => {
  fetch('http://localhost:8080/feed/posts')
    .then(res => {
    return res.json();
    console.log('Hi')
  }).then(resData => {
    console.log(resData);
  }).catch(err => {
    console.log(err);
  })
})

postButton.addEventListener('click', () => {
  fetch('http://localhost:8080/feed/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: 'code via codepen',
      content: 'Setting headers'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    return res.json();
  }).then(resData => {
    console.log(resData);
  }).catch(err => {
    console.log(err);
  })
})
    
**********************************************************************************************************************/