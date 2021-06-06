const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization"); // read the header

  if (!authHeader) {
    // check if the header is undefined
    const error = new Error("Header not found!");
    error.statusCode = 401;
    throw error; // throw err
  }

  const token = authHeader.split(" ")[1]; // read autheader and get token
//   console.log('jwt ==> ', token);
  let decodedToken; // store the token

  try {
    decodedToken = jwt.verify(token, "lakinduchandulalakinduchadandula"); // decode with the secret key
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    // check if decodedToken is undefined
    const error = new Error("Not Authenticated!");
    error.statusCode = 401;
    throw error;
  }
  
  req.userId = decodedToken.userId; // store the userId for feature use accross the application it can be extract from request
  next();
};
