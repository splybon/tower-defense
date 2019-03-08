
<template>
  <div id="app">
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
          <div class="button" @click="createEnemy" :disabled="funds < 10">
            <h4>Send Enemy</h4>
            <strong>$10</strong>
          </div>
        </div>
        <div class="flex-box">
          <div class="button" @click="createEnemy" :disabled="funds < 10">
            <h4>Build Turret</h4>
            <strong>$10</strong>
          </div>
        </div>
      </div>
      <div class="flex-row">
        <div class="flex-box">
          <div class="button" @click="createEnemy" :disabled="funds < 10">
            <h4>Upgrade Turret</h4>
            <strong>$10</strong>
          </div>
        </div>
        <div class="flex-box">
          <div class="button" @click="createEnemy" :disabled="funds < 10">
            <h4>Upgrade Economy</h4>
            <strong>$10</strong>
          </div>
        </div>
      </div>
      <div class="flex-row">
        <h4 style="flex:0.5">Select Player To Attack</h4>
        <v-select style="flex:0.5" v-model="playerToAttack" :options="playerToAttackOptions()"></v-select>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      message: 'Hello World',
      funds: 100,
      socket: null,
      sessionId: '',
      player: {},
      playerToAttack: null,
      started: false
    };
  },
  methods: {
    emitStartGame() {
      this.socket.emit('start');
    },
    addFunds() {
      this.funds += 1;
      setTimeout(() => {
        this.addFunds();
      }, 500);
    },
    createEnemy() {
      if (
        !this.playerToAttack ||
        this.playerToAttack === this.player.location
      ) {
        alert('Select A Player To Attack First');
      } else if (this.funds >= 10) {
        this.funds -= 10;
        this.socket.emit('createEnemy', this.playerToAttack);
      }
    },
    playerToAttackOptions() {
      return [1, 2, 3, 4].filter(num => num !== this.player.location);
    }
  },
  created() {
    this.socket = io('http://localhost:8080');
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
</style>
