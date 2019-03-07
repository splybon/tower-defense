import io from 'socket.io-client';

var socket;
var funds = 0;
let params = { param: 0 };

const clickStart = () => {
  console.log('clicking start');
  socket.emit('start');
  console.log('emitted start');
};

const addListeners = () => {
  document.getElementById('addEnemy').addEventListener('click', addEnemy);
  document.getElementById('start').addEventListener('click', clickStart);
};

const addEnemy = () => {
  console.log('adding enemy');
  if (funds >= 10) {
    funds -= 10;
    socket.emit('createEnemy');
  }
};

window.onload = function() {
  socket = io('http://localhost:8080');
  socket.emit('newPlayer');
  socket.on('userStart', startGame);
  addListeners();
};

const updateFunds = log => {
  console.log(log);
  console.log('funds called', funds);
  funds += 1;
  document.getElementById('funds').innerHTML = funds;
  setTimeout(() => {
    updateFunds('');
  }, 1000);
};

const startGame = () => {
  funds = 0;
  updateFunds('from start');
};
