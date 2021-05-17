const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  //console.log(req.url, req.method, req.headers); // output the incoming req

  // this will quite from registerd process and back to the command line
  // (we are don't do it in production because we dont need to down our server)
  //process.exit();

  const url = req.url; // store the url to the variable
  const method = req.method;

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

  if (url === "/message" && method === "POST") {
    const body = [];
    // this method will keep listening for data, data is coming as chunks
    req.on("data", chunk => {
      // this will push chunks to the array declare under const but it doesn't mean that we can't edit what in side it,
      // const mean that we can't declare agin
      body.push(chunk);
      console.log(chunk);
    });
    // this method can listen to end of events
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();  // buffer can concat all chunks in to one string it will output through toString
      const submitData = parsedBody.split("=")[1];  // split by "=" then put into a array index of the value is [1]
      fs.writeFileSync("message.txt", submitData);  // write into the message.txt
      console.log(submitData);
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
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
