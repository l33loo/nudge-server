var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
const uuidv4 = require('uuid/v4');
const ws = require('ws');
var connections = 0;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }
  })

  .listen(4000, '0.0.0.0', function (err, result) {
    if (err) {
      console.log(err);
    }

    console.log('Running at http://0.0.0.0:3000');
  });
// server.js

const express = require('express');
const SocketServer = require('ws').Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
var clientss = []
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

setInterval(function() {
  clients.forEach(function each(client) {
    if ((Date.now() - client[1]) > 86400000){
      console.log("WEE");
    }
  });
}, 30 * 60 * 1000); //every 30 minutes

wss.on('connection', (ws) => {
  sendConnections(connections, 'up');
  var time = Date.now();
  clients.push([ws, time]);

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => sendConnections(connections, 'down'));

});