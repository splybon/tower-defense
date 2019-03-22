
<template>
  <div id="app">
    <div v-if="active">
      <h2>Funds: ${{funds}}</h2>
      <h3>Player Number: {{player.location}}</h3>
      <hr>
      <h2>
        Actions
        <button v-if="!started" class="button" @click="emitStartGame">Start Game</button>
      </h2>
      <div class="flex-container">
        <div class="flex-row">
          <div class="flex-box">
            <div class="button" :class="{disabled: funds < 10}" @click="createEnemy">
              <h4>Send Enemy</h4>
              <strong>$10</strong>
            </div>
          </div>
          <div class="flex-box">
            <div
              class="button"
              :class="{disabled: funds < 10}"
              @click="buildTurret"
              :disabled="funds < 10"
            >
              <h4>Build Turret</h4>
              <strong>$10</strong>
            </div>
          </div>
        </div>
        <div class="flex-row">
          <div class="flex-box">
            <div class="button" @click="upgradeTurret" :disabled="funds < 10">
              <h4>Upgrade Turret</h4>
              <strong>$10</strong>
            </div>
          </div>
          <div class="flex-box">
            <div
              class="button"
              @click="upgradeEconomy"
              :class="{disabled: (funds < this.economyUpgradeCost() || economyLevel >= 8)}"
            >
              <h4>Upgrade Economy</h4>
              <strong>${{economyUpgradeCost()}}</strong>
              <br>
              <small>Level: {{economyLevel}}</small>
            </div>
          </div>
        </div>
        <div class="flex-row">
          <h4 style="flex:0.5">Select Player To Attack</h4>
          <v-select style="flex:0.5" v-model="playerToAttack" :options="playerToAttackOptions()"></v-select>
        </div>
      </div>
    </div>
    <div v-else>You Lose!</div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      funds: 25,
      socket: null,
      sessionId: '',
      player: {},
      playerToAttack: null,
      started: false,
      fundsTimeout: 1500,
      economyLevel: 1,
      turretCount: 0,
      turretUpgradeCount: 0,
      active: true
    };
  },
  methods: {
    emitStartGame() {
      this.socket.emit('start');
    },
    addFunds() {
      if (!this.active) return;
      this.funds += 1;
      setTimeout(() => {
        this.addFunds();
      }, this.fundsTimeout);
    },
    createEnemy() {
      if (
        !this.playerToAttack ||
        this.playerToAttack === this.player.location ||
        !this.active
      ) {
        alert('Select A Player To Attack First');
      } else if (this.funds >= 10) {
        this.funds -= 10;
        this.socket.emit('createEnemy', this.playerToAttack);
      }
    },
    playerToAttackOptions() {
      return [1, 2, 3, 4].filter(num => num !== this.player.location);
    },
    upgradeEconomy() {
      if (this.economyLevel >= 8 || !this.active) return;
      this.fundsTimeout -= 200;
      this.funds -= this.economyUpgradeCost();
      this.economyLevel++;
    },
    economyUpgradeCost() {
      return 13 + 2 ** this.economyLevel;
    },
    buildTurret() {
      if (this.funds < 10 || !this.active) return;
      if (this.turretCount < 4) {
        this.funds -= 10;
        this.turretCount++;
        this.socket.emit('buildTurret');
      } else {
        alert("Can't have more than 4 turrets");
      }
    },
    upgradeTurret() {
      if (this.funds < 10 || !this.active) return;
      // can only upgrade 4 times and it starts at level 1
      const remainingUpgrades = parseInt(
        this.turretUpgradeCount / this.turretCount
      );
      console.log('remaining upgrades', remainingUpgrades);
      if (remainingUpgrades >= 3) {
        alert('Max upgrades reached');
      } else {
        this.turretUpgradeCount++;
        this.funds -= 10;
        this.socket.emit('updateTurret');
      }
    }
  },
  created() {
    const location = window.location.origin.includes('localhost')
      ? 'http://localhost:8080'
      : window.location.origin;
    this.socket = io(location);
    this.socket.on('connect', () => {
      this.sessionId = this.socket.id; //
    });

    this.socket.on('userStart', () => {
      this.started = true;
      this.addFunds();
    });
    this.socket.on('updatePlayer', ({ player, playerId }) => {
      if (playerId === this.sessionId) {
        this.player = player;
      }
    });

    this.socket.emit('newPlayer');

    this.socket.on('updateLosePlayerLife', ({ lives, location }) => {
      if (location === this.player.location && lives <= 0 && this.active) {
        this.active = false;
        alert('You Have Lost!');
      }
    });
  }
};
</script>

<style>
#app {
  padding: 15px 15px;
}
.flex-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: centeer;
}
.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  flex: 1;
  margin-top: 20px;
}
.flex-box {
  flex: 0.4;
}
.button {
  background-color: #e7e7e7;
  border-radius: 10px;
  color: black;
  padding: 25px 10px;
  cursor: pointer;
  border: none;
  box-shadow: 1px 1px rgba(0, 0, 0, 0.7);
  text-align: center;
}
h4 {
  margin: 5px 0;
}
.v-select .dropdown-toggle .clear {
  visibility: hidden;
}
.disabled {
  color: #fff;
}
</style>
