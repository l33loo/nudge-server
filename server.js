
var express = require("express");
const settings = require("./settings");
var app = express();
const pg = require('pg')
var bcrypt = require('bcryptjs');
var express = require('express')(),
    mailer = require('express-mailer');
var PORT = process.env.PORT || 3000; // default port 3000
const bodyParser = require("body-parser");

function clientbuilder (source){
  console.log(source);
  const client = new pg.Client({
    user     : source.user,
    password : source.password,
    database : source.database,
    host     : source.hostname,
    port     : source.port,
    ssl      : source.ssl
  });
  return client;
}

const client = clientbuilder(settings);
client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
});
// client.connect((err) => {
//   if (err) {
//     return console.error("Connection Error", err);
//   }
//   client.query("SELECT * FROM users", (err, result) => {
//     if (err) {
//       return console.error("error running query", err);
//     }
//     for (var i = 0; i < result.rows.length; i++){
//       console.log(" -", (i + 1)+":", result.rows[i].first_name, result.rows[i].last_name);
//     }
//      //output: 1
//     client.end();
//   });
// });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var myVar = setInterval(checkInCheck, 1000);

var activeusers = {
  'xxjeffxx': {count: 0
  },
  'bkavuh@gmail.com': {count: 8
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
    if (activeusers[user].count > 10){
      const emails = pullEmailList(user);
      for (var i = 0; i < emails.length; i++){
        sendEmail(emails[i]);
      }
    }
  };
}

function pullEmailList(user){
var results = [ ];
console.log(user)
  client.query("SELECT id FROM users WHERE email LIKE '%" + user + "%'", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    console.log(result.rows[0].id)
    client.query("SELECT list FROM contacts WHERE id IN (" + result.rows[0].id + ")", (err, result) => {
      if (err) {
        return console.error("error running query", err);
      }
      console.log(result.rows[0].list)
      const emailList = result.rows[0].list[0];
      for (var i = 1; i < result.rows[0].list.length; i++){
        emailList += ', ' + result.rows[0].list[i];
      }
      console.log(emailList);
      client.query("SELECT email FROM users WHERE id IN (" + emailList + ")", (err, result) => {
        if (err) {
          return console.error("error running query", err);
        }
        console.log(result.rows)
        for (var i = 0; i < result.rows.length; i++){
          results.push(result.rows[i].email)
        }
      });
    });
  });
  return results;
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
  if (!activeusers[req.params.id]){}
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

