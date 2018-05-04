const express = require('express');
const path = require('path');
const PORT = 3000;
const app = express()

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', jsx)
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const clients = ['carl', (Date.now() - 60000)];
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.



setInterval(function() {
  console.log("Checking users");
  console.log(clients);
  clients.forEach(function each(client) {
    // if ((Date.now() - client[1]) > 86400000){
    if ((Date.now() - client[1]) > 60000){
      console.log("WEE");
    }
  });
}, 60000);
// }, 30 * 60 * 1000); //every 30 minutes

app.get('/' (req, res) => {
  res.status(200).send(`<html><body>You must enter a valid email and a password to register. <a href="/register">Try again.</a></body></html>\n`);
  res.render('/')
});