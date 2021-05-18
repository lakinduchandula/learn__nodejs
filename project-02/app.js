// 3rd party libraries
const express = require("express");

const app = express(); // this express will handle almost very thing in behind the scenes

app.use(express.urlencoded({ // this will help to catch the body in express package
  extended: true
}));

app.use('/add-product', (req, res, next) => {
  res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

// we can put get, post method insted of use after app. , app.post mean it will only run under post method
app.post('/product', (req, res, next) => { 
  console.log(req.body);
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Hello from express.js</h1>'); //  this send(); method can use to send a almost any response
});

app.listen(3000); // this will do both creating server and listen on port 3000
