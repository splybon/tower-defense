var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

const PLAYER_STATS = {
  1: {
    color: '#4286f4',
    lives: 20,
    id: null,
    path: 'y',
    direction: 1,
    initialStart: [500, 0]
  },
  2: {
    color: '#4286f4',
    lives: 20,
    id: null,
    path: 'x',
    direction: -1,
    initialStart: [1000, 500]
  },
  3: {
    color: '#4286f4',
    lives: 20,
    id: null,
    path: 'y',
    direction: -1,
    initialStart: [500, 1000]
  },
  4: {
    color: '#4286f4',
    lives: 20,
    id: null,
    path: 'x',
    direction: 1,
    initialStart: [0, 500]
  }
};

let players = {};
let assignedLocations = [];

function assignPlayerStats(socketId) {
  players[socketId] = {};
  const location = (assignedLocations[assignedLocations.length - 1] || 0) + 1;
  players[socketId].location = location;
  assignedLocations.push(location);
  Object.assign(players[socketId], PLAYER_STATS[location]);
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/game.html');
});

app.get('/player', function(req, res) {
  res.sendFile(__dirname + '/player.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('newPlayer', () => {
    players[socket.id] = {};
    assignPlayerStats(socket.id);
    console.log(players);
    socket.emit('createPlayer', players[socket.id]);
  });
});

app.set('port', 8080);
server.listen(app.get('port'), function() {
  console.log(`Listening on ${server.address().port}`);
});
