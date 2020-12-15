const http = require('http');
const nodemailer = require("nodemailer");
const {parse} = require("querystring");
const fs = require("fs");

function NodeMailerCallback(request , callback){
  let body = "";
  request.on("data", chunk => {
      body += chunk.toString();
  });
  request.on("end",()=> {
      callback(parse(body));
  });
}

const server = http.createServer((req , res) => {
    if (req.method === "POST") {
        NodeMailerCallback(req , result => {
            console.log(result);
           let transport = nodemailer.createTransport({
               service : "gmail",
               auth: {
                   user: "",
                   pass: "",
               },
           });
           //creating mail options
           let mailOptions = {
               from : "",
               to : `${result.email} , `,
               subject : `Email Subscriber`,
               html :`<h1>Subscribe to our Newsletter please confirm ${result.email}</h1>`
           };
           transport.sendMail(mailOptions , (err, email) => {
               if(err) {
                   console.log(err);
               }else{
                 console.log(email);  
               };
           });

            res.end(`Successfully email has been sent`)
    })
    }else {
           res.writeHead(200 , {"Content-Type" : "text/html"});
           fs.createReadStream(__dirname + "/email.html", "utf8").pipe(res);
    }
});

let port = 8000;
server.listen(port , err => {
    if(err) throw err;
    console.log("Web server is running on port number" + port);
})