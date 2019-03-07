
<template>
  <div id="app">
    <h2>Funds: ${{funds}}</h2>
    <h3>Player Number: {{player.location}}</h3>
    <hr>
    <h2>Actions</h2>
    <strong>$10</strong>
    <button @click="createEnemy" :disabled="funds < 10">Send Enemy</button>
    <span>(First Choose Enemy To Attack)</span>
    <br>
    <span>Enemy To Attack:</span>
    <select v-model="playerToAttack">
      <option v-if="player.location !== 1">1</option>
      <option v-if="player.location !== 2">2</option>
      <option v-if="player.location !== 3">3</option>
      <option v-if="player.location !== 4">4</option>
    </select>
    <br>
    <br>
    <br>

    <button @click="emitStartGame">Start Game</button>
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
      playerToAttack: 1
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
      if (this.funds >= 10) {
        this.funds -= 10;
        this.socket.emit('createEnemy', this.playerToAttack);
      }
    }
  },
  created() {
    this.socket = io('http://localhost:8080');
    this.socket.on('connect', () => {
      this.sessionId = this.socket.id; //
    });

    this.socket.on('userStart', this.addFunds);
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
</style>
