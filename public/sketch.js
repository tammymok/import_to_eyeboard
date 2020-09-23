// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket = io();
var size = 10;
var eraseOn = false;
cleared = false;
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
      console.log("Got: " + data.x + " " + data.y + " " + data.px + " " + data.py+" ", data.clear);
      // Draw a blue circle
      if(data.eraser){
        stroke(0);
      }else{stroke(0, 0, 255);}
      if(data.clear){
        clear();
        background(0);
        cleared = true;
      }
      else{
        strokeWeight(data.size);
        line(data.x, data.y, data.px, data.py);
      }
    }
  );
}

function triggerDraw() {
  eraseOn = false;
}
function clearCanvas(){
  if(confirm("This will clear everyone's screen! Do you want to proceed?")){
    clear();
    background(0);
    cleared = true;
  }
  //placeholder, real purpose is just to send cleared and tell everyone else to clear their canvas
  sendmouse(0,0,0,0)
}

function increaseSize(){
  if (size < 100){size += 5;}
}

function decreaseSize(){
  if (size > 5){size -= 5;}
}

function triggerErase(){
  eraseOn = true;
}
function mouseDragged() {
  // Draw some white circles
  console.log("mouseDragged");
  if (eraseOn){
    stroke(0);
  }else{ 
    stroke(255);
  }
  strokeWeight(size);
  line(mouseX, mouseY, pmouseX, pmouseY);
  
  //reset b/c we just drew
  cleared = false;
  // Send the mouse coordinates
  sendmouse(mouseX, mouseY, pmouseX, pmouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos, pxpos, pypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos + " " + pxpos + " " + pypos+" "+cleared);
  
  // Make a little object with x and y
  var data = {
    x: xpos,
    y: ypos,
    px: pxpos,
    py: pypos,
    eraser: eraseOn,
    clear: cleared,
    size: size
  };

  // Send that object to the socket
  socket.emit('mouse', data);
}