var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var path = require('path');
const shortid = require('shortid');

const PLAYER_STATS = {
  1: {
    color: '#4286f4',
    lives: 20,
    path: 'y',
    direction: 1,
    initialStart: [500, 0],
    turrets: {},
    active: true
  },
  2: {
    color: '#4286f4',
    lives: 20,
    path: 'x',
    direction: -1,
    initialStart: [1000, 500],
    turrets: {},
    active: true
  },
  3: {
    color: '#4286f4',
    lives: 20,
    path: 'y',
    direction: -1,
    initialStart: [500, 1000],
    turrets: {},
    active: true
  },
  4: {
    color: '#4286f4',
    lives: 20,
    path: 'x',
    direction: 1,
    initialStart: [0, 500],
    turrets: {},
    active: true
  }
};

let players = {};

let assignedLocations = [];

function playersRemaining() {
  let arr = [];
  Object.keys(players).forEach(key => {
    if (players[key].active) {
      arr.push(players[key].location);
    }
  });
  return arr;
}

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

function buildTurret(playerId) {
  const id = shortid.generate();
  players[playerId].turrets[id] = 1;
  return id;
}

function updateTurret(playerId) {
  const turrets = players[playerId].turrets;
  const turretId = Object.keys(turrets).reduce((acc, curr) => {
    if (turrets[curr] < (turrets[acc] || 100)) return curr;
    return acc;
  });
  if (players[playerId].turrets[turretId] < 4)
    players[playerId].turrets[turretId]++;
  return turretId;
}

function findPlayerByLocation(location) {
  let playerId;
  Object.keys(players).forEach(key => {
    if (players[key].location === location) {
      playerId = key;
    }
  });
  return playerId;
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

  socket.on('losePlayerLife', location => {
    playerId = findPlayerByLocation(location);
    players[playerId].lives -= 1;
    const lives = players[playerId].lives;
    io.emit('updateLosePlayerLife', {
      lives: players[playerId].lives,
      location: players[playerId].location
    });
    if (lives <= 0) {
      players[playerId].active = false;
    }
    if (playersRemaining().length <= 1) {
      const message = `Player ${playersRemaining()[0]} has won!!!!`;
      io.emit('victory', message);
    }
  });

  socket.on('buildTurret', function() {
    const turretId = buildTurret(socket.id);
    io.emit('userBuildTurret', {
      playerId: socket.id,
      turretCount: Object.keys(players[socket.id].turrets).length,
      turretId: turretId,
      level: players[socket.id].turrets[turretId]
    });
  });

  socket.on('updateTurret', function() {
    const turretId = updateTurret(socket.id);
    io.emit('userUpdateTurret', {
      turretId,
      level: players[socket.id].turrets[turretId]
    });
  });
});

app.set('port', process.env.PORT || 8080);
server.listen(app.get('port'), function() {
  console.log(`Listening on ${server.address().port}`);
});

app.get('/player', function(req, res) {
  res.sendFile(path.resolve('dist/player.html'));
});

app.get('/game', function(req, res) {
  res.sendFile(path.resolve('dist/game.html'));
});

app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));

// app.get('/dist/vendor.bundle.js', function(req, res) {
//   res.sendFile(path.resolve('dist/vendor.bundle.js'));
// });

// app.get('/dist/player.js', function(req, res) {
//   res.sendFile(path.resolve('dist/player.js'));
// });
