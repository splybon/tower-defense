var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var path = require('path');

const PLAYER_STATS = {
  1: {
    color: '#4286f4',
    lives: 20,
    path: 'y',
    direction: 1,
    initialStart: [500, 0],
    turretCount: 0
  },
  2: {
    color: '#4286f4',
    lives: 20,
    path: 'x',
    direction: -1,
    initialStart: [1000, 500],
    turretCount: 0
  },
  3: {
    color: '#4286f4',
    lives: 20,
    path: 'y',
    direction: -1,
    initialStart: [500, 1000],
    turretCount: 0
  },
  4: {
    color: '#4286f4',
    lives: 20,
    path: 'x',
    direction: 1,
    initialStart: [0, 500],
    turretCount: 0
  }
};

let players = {};

let assignedLocations = [];

function assignPlayerStats(socketId) {
  players[socketId] = {};
  const location = (assignedLocations[assignedLocations.length - 1] || 0) + 1;
  players[socketId].location = location;
  assignedLocations.push(location);
  if (location > 4) {
    location = 4;
  }
  Object.assign(players[socketId], PLAYER_STATS[location] || PLAYER_STATS[4]);
}

io.on('connection', function(socket) {
  console.log('new connection with socket:', socket.id);
  socket.on('newPlayer', () => {
    players[socket.id] = {};
    assignPlayerStats(socket.id);
    io.emit('updatePlayer', {
      player: players[socket.id],
      playerId: socket.id
    });
  });

  socket.on('createEnemy', playerToAttack => {
    socket.broadcast.emit('userCreateEnemy', {
      playerId: socket.id,
      playerToAttack
    });
  });

  socket.on('start', () => {
    io.emit('userStart');
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });

  socket.on('losePlayerLife', playerId => {
    players[playerId].lives -= 1;
    io.emit('updatePlayer', {
      player: players[socket.id],
      playerId: socket.id
    });
  });

  socket.on('buildTurret', function() {
    players[socket.id].turretCount++;
    io.emit('userBuildTurret', {
      playerId: socket.id,
      turretCount: players[socket.id].turretCount
    });
  });
});

app.set('port', 8080);
server.listen(app.get('port'), function() {
  console.log(`Listening on ${server.address().port}`);
});

app.get('/player', function(req, res) {
  res.sendFile(path.resolve('dist/player.html'));
});

app.use('/dist', express.static('dist'));

// app.get('/dist/vendor.bundle.js', function(req, res) {
//   res.sendFile(path.resolve('dist/vendor.bundle.js'));
// });

// app.get('/dist/player.js', function(req, res) {
//   res.sendFile(path.resolve('dist/player.js'));
// });
