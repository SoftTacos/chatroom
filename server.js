const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs   = require('fs');
//const EventEmitter = reqiure('events');
const util = require('util');
const mysql = require('mysql');

var port = 3000;//process.env.PORT || 3000

messages = [];//contains all messages, saved and unsaved
firstUnsavedMessage = 0;

http.listen(port, () => {
  console.log('listening on: ' + port);
});

var databaseConnection = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "password",
  database: "chatroom"
});

loadMessages();




app.get('/', (request, response) => {
  console.log('USER CONNECTED');
  response.sendFile(__dirname + '/index.html');
  //console.log("CLIENTS " + io.clients);
});

io.on('connection', (socket) => {
  socket.on('chat message', (message) => {
    //var clientName = calcClientName(socket);
    if(!message.username)
      message.username = "anonymous";
    messages.push([message.username, message.message]);
    io.emit('chat message', message);
    console.log('Message sent: ', JSON.stringify(message));
    saveMessages();
  });
  
  socket.on('sendOldMessages', () => {
    io.to(socket.id).emit('sendOldMessages', messages);    
  });
});

function loadMessages(){
    var query = "SELECT * FROM messages";
    databaseConnection.query(query, (err, result, fields) => {//result is an array of hashes[row#]["column name"], fields returns column data
      if (err) throw err;
      for(i = 0; i < result.length; i++){
        messages.push([result[i].username, result[i].message]);

      }
      firstUnsavedMessage = messages.length;
      console.log("Successfully pulled messages");
    });
}

function saveMessages(){
  if(firstUnsavedMessage == messages.length){
    console.log("No new messages to save to database");
    return;
  }
  var query = "INSERT INTO messages (username, message) VALUES ?";
  var values = messages.slice(firstUnsavedMessage);

  databaseConnection.query(query, [values], (err, result) => {
    if(err) throw err;
    console.log("Successfully pushed messages");
    firstUnsavedMessage = messages.length;
  });
}

/* BELOW THIS LINE IS DOODLES FOR LEARNING, please ignore
app.get('/', function(request, response){
  //res.sendFile(__dirname + '/client');
  fs.readFile('client.html', 'utf8', (err, data) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.end(data);
  });
  //res.send(clientPage);
});
*/
/*io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message received ', msg);
    io.emit('chat message', msg);
  });
});*/
/*
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message recebed ', msg);
    io.emit('chat message', msg);
  });
});

//socket.broadcast.emit('hi'); to send to everyone except for a certain socket

http.listen(3000, () => {
  console.log('listening on *:3000');
});

/*
//request is a ReadableStream, response is a WritableStream
const server = http.createServer((request, response) => {//this function is the request handler, gets called every time an HTTP request is made against the server
  const {headers, method, url} = request
  //const userAgent = headers['user-agent'];//rawHeaders is also available
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
  console.log("STUFF: " + request.url);
  // at this point, `body` has the entire request body stored in it as a string
  });
  
  fs.readFile('client', 'utf8', (err, data) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.end(data);
  });
}).listen(9001);

/*
server.on('listening', (request, response) => {
    console.log('idklol :)');

});
*/
