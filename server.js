
var express = require("express");
var app = express();
var express = require('express')(),
    mailer = require('express-mailer');
var PORT = process.env.PORT || 3000; // default port 3000
const bodyParser = require("body-parser");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var myVar = setInterval(checkInCheck, 5000);

var activeusers = {
  'xxjeffxx': {count: 0
  },
  'Brianator': {count: 0
  }
};


mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'nudge.project.head@gmail.com',
    pass: 'lighthouse01'
  }
});


function checkInCheck() {
  for (var user in activeusers){
    activeusers[user].count += 1;
    console.log("test up", user, activeusers[user].count);
    if (activeusers[user].count > 100){
      sendEmail('bkavuh@gmail.com');
    }
  };
}

function temp1(){

}

function sendEmail(email){
  app.mailer.send('email', {
    to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
    subject: 'Test Email', // REQUIRED.
    otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
  }, function (err) {
    if (err) {
      // handle error
      console.log(err);
      console.log('There was an error sending the email');
      return;
    }
    console.log('Email Sent');
  });
};


app.get("/:id", (req, res) => {
  activeusers[req.params.id].count = 0;
  res.redirect("http://localhost:8080");
});

app.get("/login/:id", (req, res) => {
  activeusers[req.params.id] = {count : 0}
  res.redirect("http://localhost:8080");
});

app.get("/logout/:id", (req, res) => {
  delete activeusers[req.params.id];
  res.redirect("http://localhost:8080");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

