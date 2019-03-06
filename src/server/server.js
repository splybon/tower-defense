var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

let players = {};
let assignedLocations = [];

function assignPlayerLocation(socketId) {
  players[socket.id] = {};
  const location = assignedLocations[assignedLocations.length - 1] || 0;
  players[socket.id] = location + 1;
  assignedLocations.push(location);
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/game.html');
});

app.get('/player', function(req, res) {
  res.sendFile(__dirname + '/player.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('createNewPlayer', () => {
    players[socket.id] = {};
    assignPlayerLocation(socket.id);
    socket.broadcast.emit('newPlayer', {
      player: players[socket.id],
      id: socket.id
    });
  });
});

app.set('port', 8080);
server.listen(app.get('port'), function() {
  console.log(`Listening on ${server.address().port}`);
});
