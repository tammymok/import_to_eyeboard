// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

// Using express: http://expressjs.com/
var express = require('express');
const socketIO = require('socket.io');

// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
  
    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);
      
        // Send it to all other clients
        socket.broadcast.emit('mouse', data);
        
        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);

var messages = [];

var cookie = {
  index: 0
};

// io = server
// socket = client(s)


// Handle connections (on first connection)
io.on('connection', (socket) => {
  console.log('Client connected');

  // listen for chat message being emitted
  socket.on('chat message', (msg) => {
    messages.push(msg);           // add message to char array
    io.emit('chat message', msg); // send messages to everyone
  });

  console.log('emitting messages...');
  // write entire array 
  messages.forEach((msg) => socket.emit('chat message', msg));

  // Listen for disconnect
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Broadcast updates
//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

// Display static HTML page (hopefully including JS)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
