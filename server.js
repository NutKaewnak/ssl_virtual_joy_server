#!/usr/bin/env node

express = require('express');
app = express();
http = require('http').Server(app);
app.use(express["static"](__dirname + '/public'));
config = require('./config.json');
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
http.listen(config.port, function() {
  return console.info("Listening on " + config.port);
});

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8081 });
var allowedOrigins = "http://localhost:*";

var clients = []
var admins = []

wss.on('connection', function connection(ws) {
  console.log(ws.upgradeReq.url);

  if(getParameterByName('permission', ws.upgradeReq.url) == "admin"){
    admins.push(ws);
  }
  else{
    clients.push(ws);
  }

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    data = JSON.parse(message);
    feedback = {feedback_id: data['id'], type: 9, data: data['data']}
    if(admins) {
        for(var i=0; i<admins.length; i++) {
            admins[i].send(message);
        }
    }
    if(clients) {
      if(data['type'] == 0){
        ws.send(message);
        return;
      }
      feedback = JSON.stringify(feedback)
      for(var i=0; i<clients.length; i++) {
        clients[i].send(feedback);
      }
    }
  });

  ws.on('close', function close() {
    for(var i = 0; i < admins.length; i++) {
            // # Remove from our connections list so we don't send
            // # to a dead socket
        if(admins[i] == ws) {
          admins.splice(i);
          break;
        }
    }
    for(var i = 0; i < clients.length; i++) {
      // # Remove from our connections list so we don't send
      // # to a dead socket
      if(clients[i] == ws) {
        clients.splice(i);
        break;
      }
    }
  });

  console.log('Client connected!');

});

function statusFeedback(id) {
  if (clients) {
      feedback = JSON.stringify({feedback_id: id, type: 0x09, battery: 100, errorCode: 'none'});

      for(var i=0; i<clients.length; i++) {
        clients[i].send(feedback);
      }
  }
  setTimeout(function(){ statusFeedback("02") }, 1000);
}
statusFeedback("02");

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
