/* 
 * Handles connections
 */

var socket = io(); // get socket

// on form submit
$('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});


socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    console.log('appending chat msg');
});
