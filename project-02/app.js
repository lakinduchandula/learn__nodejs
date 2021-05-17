const http = require("http");

const server = http.createServer((req, res) => {
  //console.log(req.url, req.method, req.headers); // output the incoming req

  // this will quite from registerd process and back to the command line
  // (we are don't do it in production because we dont need to down our server)
  //process.exit();

  const url = req.url; // store the url to the variable

  // if the url is '/'
  if (url === "/") {
    res.setHeader("Content-Type", "text/html"); // set the content type as 'text/html'
    res.write("<html>");
    res.write("<head><title>Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Submit</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }

  // set up Header
  res.setHeader("Content-Type", "text/html"); // set the content type as 'text/html'
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my NodeJS Server!</h1></body>");
  res.write("</html>");
  res.end();
});

server.listen(3000); // this line will listen through port 3000 when it's done it will run line 3