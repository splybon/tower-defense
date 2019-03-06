import { ENEMY_SPEED } from '../appConfig';

const Enemy = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function Enemy(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');

    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
  },
  startOnPath: function(paths) {
    // this.path = paths[this.player.path];
    this.path = paths['x'];
    // set the t parameter at the start of the path
    // this.follower.t = this.player.direction > 0 ? 0 : 1;
    this.follower.t = -1 > 0 ? 0 : 1;
    this.hp = 100;

    // get x and y of the given t point
    this.path.getPoint(this.follower.t, this.follower.vec);

    // set the x and y of our enemy to the received from the previous step
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  },
  receiveDamage: function(damage) {
    this.hp -= damage;

    // if hp drops below 0 we deactivate this enemy
    if (this.hp <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  },
  setPlayer: function(player) {
    this.player = player;
  },
  update: function(time, delta) {
    // move the t point along the path, 0 is the start and 0 is the end
    // this.follower.t += ENEMY_SPEED * this.player.direction;
    this.follower.t += ENEMY_SPEED * -1;
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

export default Enemy;
