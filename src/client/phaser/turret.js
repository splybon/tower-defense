import Phaser from 'phaser';

function getEnemy(enemies, x, y, distance, location) {
  var enemyUnits = enemies.getChildren();
  for (var i = 0; i < enemyUnits.length; i++) {
    if (enemyUnits[i].player.location === location) continue;
    if (
      enemyUnits[i].active &&
      Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <=
        distance
    )
      return enemyUnits[i];
  }
  return false;
}

function addBullet(bullets, x, y, angle, level) {
  var bullet = bullets.get();
  if (bullet) {
    bullet.fire(x, y, angle, level);
  }
}

const Turret = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function Turret(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
    this.nextTic = 0;
  },
  setVars: function({ enemies, bullets, location, level, id, text }) {
    this.location = location;
    this.enemies = enemies;
    this.bullets = bullets;
    this.level = level;
    this.id = id;
    this.text = text;
  },
  updateLevel(level) {
    console.log('updating level to ', level);
    this.level = level;
    this.text.setText(`level ${this.level}`);
  },
  // we will place the turret according to the grid
  place: function(i, j) {
    this.y = i * 100 + 100 / 2 + 100;
    this.x = j * 100 + 100 / 2 + 100;
    this.text.setX(this.x - 30);
    this.text.setY(this.y + 32);
  },
  fire: function() {
    var enemy = getEnemy(this.enemies, this.x, this.y, 200, this.location);
    if (enemy) {
      var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      addBullet(this.bullets, this.x, this.y, angle, this.level);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }
  },
  update: function(time, delta) {
    // time to shoot
    if (time > this.nextTic) {
      this.fire();
      this.nextTic = time + 1000;
    }
  }
});

export default Turret;
