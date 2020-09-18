// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket = io();
var size = 10;
function setup() {
  cnv = createCanvas(600, 600);
  cnv.position(window.innerWidth/2-300, window.innerHeight/2-300);
  background(0);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  //socket = io.connect('http://localhost:3000');
  //socket = io.connect('https://eyeboard.herokuapp.com/');

  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y + " " + data.px + " " + data.py);
      // Draw a blue circle
      stroke(0, 0, 255);
      strokeWeight(5);
      line(data.x, data.y, data.px, data.py);
    }
  );
}

function draw() {
  // Nothing
}

function mouseDragged() {
  // Draw some white circles
  stroke(255);
  strokeWeight(5);
  line(mouseX, mouseY, pmouseX, pmouseY);
  
  // Send the mouse coordinates
  sendmouse(mouseX, mouseY, pmouseX, pmouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos, pxpos, pypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos + " " + pxpos + " " + pypos);
  
  // Make a little object with x and y
  var data = {
    x: xpos,
    y: ypos,
    px: pxpos,
    py: pypos
  };

  // Send that object to the socket
  socket.emit('mouse', data);
}