import io from 'socket.io-client';

let socket;

const socketListeners = players => {
  socket = io('http://localhost:8080');
  socket.emit('newPlayer');
  socket.on('createPlayer', player => {
    players[socket.id] = player;
    console.log(players);
  });
};

export default socketListeners;
