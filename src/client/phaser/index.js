import Phaser from 'phaser';
import Enemy from './enemy';
import Turret from './turret';
import Bullet from './Bullet';

import { MAP, BULLET_DAMAGE, PLAYER_STATS } from './config';

import io from 'socket.io-client';

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 1000,
  height: 1000,
  physics: {
    default: 'arcade'
  },
  scene: {
    key: 'main',
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

var players = {};

var enemies;
var turrets;
var bullets;
var paths = {};
var socket;

function preload() {
  // load the game assets – enemy and turret atlas
  this.load.atlas(
    'sprites',
    'assets/spritesheet.png',
    'assets/spritesheet.json'
  );
  this.load.image('bullet', 'assets/bullet.png');
}

function create() {
  var graphics = this.add.graphics();
  drawGrid(graphics);
  // this graphics element is only for visualization,
  // its not related to our path
  var graphics = this.add.graphics();

  // the path for our enemies
  // parameters are the start x and y of our path
  paths['y'] = this.add.path(500, 0);
  paths['y'].lineTo(500, 1000);
  paths['x'] = this.add.path(0, 500);
  paths['x'].lineTo(1000, 500);

  graphics.lineStyle(3, 0xffffff, 1);
  // visualize the path
  paths['x'].draw(graphics);
  paths['y'].draw(graphics);

  enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
  this.nextEnemy = 0;
  turrets = this.add.group({ classType: Turret, runChildUpdate: true });
  this.input.on('pointerdown', placePointerTurret);
  bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  this.physics.add.overlap(enemies, bullets, damageEnemy);

  socketListeners(players);
}

function update(time, delta) {}

function drawGrid(graphics) {
  graphics.lineStyle(1, 0x0000ff, 0.8);
  for (var i = 0; i < 10; i++) {
    graphics.moveTo(0, i * 100);
    graphics.lineTo(1000, i * 100);
  }
  for (var j = 0; j < 10; j++) {
    graphics.moveTo(j * 100, 0);
    graphics.lineTo(j * 100, 1000);
  }
  graphics.strokePath();
}

function placePointerTurret(pointer) {
  const i = Math.floor(pointer.y / 100);
  const j = Math.floor(pointer.x / 100);
  console.log('i', i);
  console.log('j', j);
  if (MAP[i][j] === 0) {
    const turret = turrets.get();
    if (turret) {
      turret.setActive(true);
      turret.setVisible(true);
      turret.setVars({ enemies, bullets });
      turret.place(i, j);
      MAP[i][j] === 1;
    }
  }
}

function placeTurret(playerId, turretCount) {
  const turret = turrets.get();
  if (turret) {
    const { location } = players[playerId];
    const j = PLAYER_STATS[location].turretPlacement[turretCount][0];
    const i = PLAYER_STATS[location].turretPlacement[turretCount][1];
    turret.setActive(true);
    turret.setVisible(true);
    turret.setVars({ enemies, bullets, location });
    turret.place(i, j);
    console.log('turretPlaced');
  }
}

function damageEnemy(enemy, bullet) {
  // only if both enemy and bullet are alive
  if (enemy.active === true && bullet.active === true) {
    // we remove the bullet right away
    bullet.setActive(false);
    bullet.setVisible(false);

    // decrease the enemy hp with BULLET_DAMAGE
    enemy.receiveDamage(BULLET_DAMAGE);
  }
}

function socketListeners() {
  socket = io('http://localhost:8080');
  // socket.emit('newPlayer');
  socket.on('updatePlayer', ({ player, playerId }) => {
    players[playerId] = player;
    console.log(players);
  });

  socket.on('userCreateEnemy', ({ playerId, playerToAttack }) => {
    console.log('creating enemy for player', playerToAttack);
    var enemy = enemies.get();
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);
      // place the enemy at the start of the path
      enemy.setData({
        player: players[playerId],
        playerToAttack
      });
      enemy.startOnPath(paths);
    }
  });

  socket.on('userBuildTurret', ({ playerId, turretCount }) => {
    players[playerId].turretCount;
    placeTurret(playerId, turretCount);
  });
}
