const http = require('http'); 

const server = http.createServer((req, res) => { 
    console.log(req.url, req.method, req.headers); // output the incoming req

    // this will quite from registerd process and back to the command line 
    // (we are don't do it in production because we dont need to down our server)
    //process.exit(); 
});

server.listen(3000); // this line will listen through port 3000 when it's done it will run line 3