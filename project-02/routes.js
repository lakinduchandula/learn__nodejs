const fs = require("fs");

const requestHandler = (req, res, next) => {
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
    // this method will keep listening for data event, data is coming as chunks
    req.on("data", chunk => {
      // this will push chunks to the array declare under const but it doesn't mean that we can't edit what in side it,
      // const mean that we can't declare agin
      body.push(chunk);
      console.log(chunk);
    });
    // this method can listen to end event
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString(); // buffer can concat all chunks in to one string it will output through toString
      const submitData = parsedBody.split("=")[1]; // split by "=" then put into a array index of the value is [1]

      /*** when writig file there is two methods one is fs.writeFile and fs.writeFileSync ; 
           Sync means that this method will block the code execution until the file does it work 
      ***/
      fs.writeFile("message.txt", submitData, err => {
        // third one is a callback function when it's done get executes
        // all code under this will execute when this method only done it's work and it's easy to err handling
        console.log(submitData);
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      }); // write into the message.txt

      /********************************************************************
       * In here this is a callback function, this function will not
       * execute immediately when "req.on("end", ..)" is registerd.
       * beacuse of that we call this functions as asynchronous functions,
       * after this compiler will execute from line 54
       ********************************************************************/
    });
  }

  // set up Header
  res.setHeader("Content-Type", "text/html"); // set the content type as 'text/html'
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my NodeJS Server!</h1></body>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;
