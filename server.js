
var express = require("express");
const settings = require("./settings");
var app = express();
const pg = require('pg');

var bcrypt = require('bcryptjs');
var express = require('express')(),
    mailer = require('express-mailer');
var PORT = process.env.PORT || 3000; // default port 3000
const bodyParser = require("body-parser");

function clientbuilder (source){
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
// heroku client connect
// function clientbuilder (source){
//   const client = new pg.Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   });
//   return client;
// }

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
  var emails = [];
  var contactList = '';
  for (var user in activeusers){
    activeusers[user].count += 1;

    if (activeusers[user].count > 10){

      client.query("SELECT id FROM users WHERE email LIKE '%" + user + "%'", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }

    client.query("SELECT contact_id FROM contacts WHERE owner_id = (" + result.rows[0].id + ")", (err, result) => {
      if (err) {
        return console.error("error running query", err);
      }

      contactList += result.rows[0].contact_id;
      for (var i = 1; i < result.rows.length; i++){
        contactList += ", " + (result.rows[i].contact_id);
      }

      client.query("SELECT email FROM users WHERE id IN (" + contactList + ")", (err, result) => {
        if (err) {
          return console.error("error running query", err);
        }
        for (var i = 0; i < result.rows.length; i++){
          emails.push(result.rows[i].email);
        }

        console.log("emails",emails);
      // for (var i = 0; i < emails.length; i++){
      //  sendEmail(emails[i]);
      // }
        });
      });
     });
   }
  };
}

function addContact(user, email, name){
var owner;
var contact;
  client.query("SELECT EXISTS (SELECT 1 FROM user WHERE email LIKE '%"+ email+"%'", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    if (result.rows[0] == 'f'){
      client.query("INSERT INTO users (email) VALUES (" + email + ")", (err, result) => {
        if (err) {
          return console.error("error inserting query", err);
        }
      });
    }
  });

  client.query("SELECT id FROM users WHERE email LIKE '%" + email + "%'", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    contact = result.rows[0].id;
    client.query("SELECT id FROM users WHERE email LIKE '%" + user + "%'", (err, result) => {
      if (err) {
        return console.error("error running query", err);
      }
      owner = result.rows[0].id;
      client.query("INSERT INTO contacts (owner_id, contact_id, nickname) VALUES (" + owner + ", " + contact + ", " + name + ")", (err, result) => {
        if (err) {
          return console.error("error inserting query", err);
        }
      });
    });
  });
}

// async function pullEmailList(user){
// var contactList = '';
// var results = [];
// // console.log(user)
//   client.query("SELECT id FROM users WHERE email LIKE '%" + user + "%'", (err, result) => {
//     if (err) {
//       return console.error("error running query", err);
//     }
//     // console.log(result.rows[0].id)
//     client.query("SELECT contact_id FROM contacts WHERE owner_id = (" + result.rows[0].id + ")", (err, result) => {
//       if (err) {
//         return console.error("error running query", err);
//       }
//       // console.log("HERE",result.rows[0].contact_id)
//       contactList += result.rows[0].contact_id;
//       for (var i = 1; i < result.rows.length; i++){
//         contactList += ", " + (result.rows[i].contact_id);
//       }
//       // console.log(contactList);
//       client.query("SELECT email FROM users WHERE id IN (" + contactList + ")", (err, result) => {
//         if (err) {
//           return console.error("error running query", err);
//         }
//         for (var i = 0; i < result.rows.length; i++){
//           results = [result.rows[i].email];
//         }
//         console.log("results", results);
//         return results;
//       });
//     });
//   });
// }

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

app.post("/update/:id", (req, res) => {
  addContact(req.params.id, req.body.email, req.body.name);
  res.redirect("http://localhost:8080");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

