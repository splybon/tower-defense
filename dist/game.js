webpackJsonp([1],{

/***/ 1502:
/*!************************************!*\
  !*** ./src/client/phaser/enemy.js ***!
  \************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = __webpack_require__(/*! ./config */ 320);

var Enemy = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function Enemy(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');

    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
  },
  startOnPath: function startOnPath(paths) {
    this.paths = paths;
    this.path = this.paths[this.player.path];
    // set the t parameter at the start of the path
    this.follower.t = this.direction > 0 ? 0 : 1;
    this.hp = 30;

    // get x and y of the given t point
    this.path.getPoint(this.follower.t, this.follower.vec);

    // set the x and y of our enemy to the received from the previous step
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  },
  receiveDamage: function receiveDamage(damage) {
    this.hp -= damage;

    // if hp drops below 0 we deactivate this enemy
    if (this.hp <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  },
  setData: function setData(_ref) {
    var player = _ref.player,
        playerToAttack = _ref.playerToAttack;

    this.player = player;
    this.playerToAttack = playerToAttack;
    this.direction = this.player.direction;
    this.changedPosition = false;
  },
  setHalfwayPath: function setHalfwayPath() {
    this.path = this.paths[_config.PLAYER_STATS[this.playerToAttack].path];
    this.direction = _config.PLAYER_STATS[this.playerToAttack].direction * -1;
  },
  update: function update(time, delta) {
    // move the t point along the path, 0 is the start and 0 is the end
    this.follower.t += _config.ENEMY_SPEED * this.direction;
    var newT = this.follower.t;

    if (!this.changedPosition && this.direction === 1 && newT >= 0.5 || this.direction === -1 && newT <= 0.5) {
      this.setHalfwayPath();
    }
    // get the new x and y coordinates in vec
    this.path.getPoint(this.follower.t, this.follower.vec);

    // update enemy x and y to the newly obtained x and y
    this.setPosition(this.follower.vec.x, this.follower.vec.y);

    // if we have reached the end of the path, remove the enemy
    if (this.follower.t > 1 || this.follower.t < 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
});

exports.default = Enemy;

/***/ }),

/***/ 1503:
/*!*************************************!*\
  !*** ./src/client/phaser/turret.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _phaser = __webpack_require__(/*! phaser */ 238);

var _phaser2 = _interopRequireDefault(_phaser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getEnemy(enemies, x, y, distance, location) {
  var enemyUnits = enemies.getChildren();
  for (var i = 0; i < enemyUnits.length; i++) {
    if (enemyUnits[i].player.location === location) continue;
    if (enemyUnits[i].active && _phaser2.default.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance) return enemyUnits[i];
  }
  return false;
}

function addBullet(bullets, x, y, angle, level) {
  var bullet = bullets.get();
  if (bullet) {
    bullet.fire(x, y, angle, level);
  }
}

var Turret = new _phaser2.default.Class({
  Extends: _phaser2.default.GameObjects.Image,

  initialize: function Turret(scene) {
    _phaser2.default.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
    this.nextTic = 0;
  },
  setVars: function setVars(_ref) {
    var enemies = _ref.enemies,
        bullets = _ref.bullets,
        location = _ref.location,
        level = _ref.level,
        id = _ref.id,
        text = _ref.text;

    this.location = location;
    this.enemies = enemies;
    this.bullets = bullets;
    this.level = level;
    this.id = id;
    this.text = text;
  },
  updateLevel: function updateLevel(level) {
    console.log('updating level to ', level);
    this.level = level;
    this.text.setText('level ' + this.level);
  },

  // we will place the turret according to the grid
  place: function place(i, j) {
    this.y = i * 100 + 100 / 2;
    this.x = j * 100 + 100 / 2;
    this.text.setX(this.x - 30);
    this.text.setY(this.y + 32);
  },
  fire: function fire() {
    var enemy = getEnemy(this.enemies, this.x, this.y, 200, this.location);
    if (enemy) {
      var angle = _phaser2.default.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      addBullet(this.bullets, this.x, this.y, angle, this.level);
      this.angle = (angle + Math.PI / 2) * _phaser2.default.Math.RAD_TO_DEG;
    }
  },
  update: function update(time, delta) {
    // time to shoot
    if (time > this.nextTic) {
      this.fire();
      this.nextTic = time + 1000;
    }
  }
});

exports.default = Turret;

/***/ }),

/***/ 1504:
/*!*************************************!*\
  !*** ./src/client/phaser/Bullet.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = __webpack_require__(/*! ./config */ 320);

var Bullet = Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function Bullet(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

    this.dx = 0;
    this.dy = 0;
    this.lifespan = 0;

    this.speed = Phaser.Math.GetSpeed(600, 1);
  },

  fire: function fire(x, y, angle, level) {
    this.level = level;
    this.setActive(true);
    this.setVisible(true);

    //  Bullets fire from the middle of the screen to the given x/y
    this.setPosition(x, y);

    //  we don't need to rotate the bullets as they are round
    //  this.setRotation(angle);

    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);

    this.lifespan = 1000;
  },
  damage: function damage() {
    var damage = _config.BULLET_DAMAGE * Math.min(this.level, 4);
    console.log('firing with damage', damage);
    return damage;
  },

  update: function update(time, delta) {
    this.lifespan -= delta;

    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);

    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
});

exports.default = Bullet;

/***/ }),

/***/ 320:
/*!*************************************!*\
  !*** ./src/client/phaser/config.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var MAP = exports.MAP = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
var BULLET_DAMAGE = exports.BULLET_DAMAGE = 10;
var ENEMY_SPEED = exports.ENEMY_SPEED = 15 / 10000;
var PLAYER_STATS = exports.PLAYER_STATS = {
  1: {
    color: '#4286f4',
    lives: 20,
    path: 'y',
    direction: 1,
    initialStart: [500, 0],
    turretCount: 0,
    turretPlacement: {
      1: [4, 0],
      2: [5, 0],
      3: [4, 1],
      4: [5, 1]
    }
  },
  2: {
    color: '#4286f4',
    lives: 20,
    path: 'x',
    direction: -1,
    initialStart: [1000, 500],
    turretCount: 0,
    turretPlacement: {
      1: [9, 4],
      2: [9, 5],
      3: [8, 4],
      4: [8, 5]
    }
  },
  3: {
    color: '#4286f4',
    lives: 20,
    path: 'y',
    direction: -1,
    initialStart: [500, 1000],
    turretCount: 0,
    turretPlacement: {
      1: [4, 9],
      2: [5, 9],
      3: [4, 8],
      4: [5, 8]
    }
  },
  4: {
    color: '#4286f4',
    lives: 20,
    path: 'x',
    direction: 1,
    initialStart: [0, 500],
    turretCount: 0,
    turretPlacement: {
      1: [0, 4],
      2: [0, 5],
      3: [1, 4],
      4: [1, 5]
    }
  }
};

/***/ }),

/***/ 619:
/*!************************************************!*\
  !*** multi babel-polyfill ./src/client/phaser ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! babel-polyfill */326);
module.exports = __webpack_require__(/*! /Users/scott.plybon/Games/tower-defense/src/client/phaser */821);


/***/ }),

/***/ 821:
/*!************************************!*\
  !*** ./src/client/phaser/index.js ***!
  \************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _phaser = __webpack_require__(/*! phaser */ 238);

var _phaser2 = _interopRequireDefault(_phaser);

var _enemy = __webpack_require__(/*! ./enemy */ 1502);

var _enemy2 = _interopRequireDefault(_enemy);

var _turret = __webpack_require__(/*! ./turret */ 1503);

var _turret2 = _interopRequireDefault(_turret);

var _Bullet = __webpack_require__(/*! ./Bullet */ 1504);

var _Bullet2 = _interopRequireDefault(_Bullet);

var _config = __webpack_require__(/*! ./config */ 320);

var _socket = __webpack_require__(/*! socket.io-client */ 604);

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
  type: _phaser2.default.AUTO,
  parent: 'content',
  width: 1000,
  height: 1000,
  physics: {
    default: 'arcade'
  },
  scene: {
    key: 'main',
    preload: preload,
    create: create,
    update: update
  }
};

var game = new _phaser2.default.Game(config);

var players = {};

var enemies;
var turrets;
var bullets;
var paths = {};
var socket;
var turretTracker = {};

function preload() {
  // load the game assets – enemy and turret atlas
  this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
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

  enemies = this.physics.add.group({ classType: _enemy2.default, runChildUpdate: true });
  this.nextEnemy = 0;
  turrets = this.add.group({ classType: _turret2.default, runChildUpdate: true });
  bullets = this.physics.add.group({ classType: _Bullet2.default, runChildUpdate: true });
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

function placeTurret(playerId, turretCount, level, id) {
  var turret = turrets.get();
  turretTracker[id] = turret;
  if (turret) {
    var location = players[playerId].location;

    var j = _config.PLAYER_STATS[location].turretPlacement[turretCount][0];
    var i = _config.PLAYER_STATS[location].turretPlacement[turretCount][1];
    var text = game.scene.scenes[0].add.text(0, 0, 'Level 1', {
      fontSize: '15px',
      fill: '#ffffff'
    });
    turret.setActive(true);
    turret.setVisible(true);
    turret.setVars({ enemies: enemies, bullets: bullets, location: location, level: level, id: id, text: text });
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
    enemy.receiveDamage(bullet.damage());
  }
}

function socketListeners() {
  var location = window.location.origin.includes('localhost') ? 'http://localhost:8080' : window.location.origin;
  socket = (0, _socket2.default)(location);
  // socket.emit('newPlayer');
  socket.on('updatePlayer', function (_ref) {
    var player = _ref.player,
        playerId = _ref.playerId;

    players[playerId] = player;
    console.log(players);
  });

  socket.on('userCreateEnemy', function (_ref2) {
    var playerId = _ref2.playerId,
        playerToAttack = _ref2.playerToAttack;

    console.log('creating enemy for player', playerToAttack);
    var enemy = enemies.get();
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);
      // place the enemy at the start of the path
      enemy.setData({
        player: players[playerId],
        playerToAttack: playerToAttack
      });
      enemy.startOnPath(paths);
    }
  });

  socket.on('userBuildTurret', function (_ref3) {
    var playerId = _ref3.playerId,
        turretCount = _ref3.turretCount,
        turretId = _ref3.turretId,
        level = _ref3.level;

    players[playerId].turretCount;
    placeTurret(playerId, turretCount, level, turretId);
  });

  socket.on('userUpdateTurret', function (_ref4) {
    var level = _ref4.level,
        turretId = _ref4.turretId;

    turretTracker[turretId].updateLevel(level);
  });
}

/***/ })

},[619]);
//# sourceMappingURL=game.js.map