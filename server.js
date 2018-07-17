const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs   = require('fs');
//const EventEmitter = reqiure('events');
const util = require('util');

var port = 3000;//process.env.PORT || 3000

app.get('/', (req, res) => {
  console.log('USER CONNECTED');
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log('got em: ', msg);
  });
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});

/*
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
