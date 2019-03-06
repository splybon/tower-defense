export const MAP = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
export const BULLET_DAMAGE = 10;
export const ENEMY_SPEED = 15 / 10000;
export const PLAYERS_STATS = {
  1: {
    color: '#4286f4',
    lives: 20,
    id: null,
    path: 'y',
    direction: 1,
    initialStart: [500, 0]
  },
  2: {
    color: '#4286f4',
    lives: 20,
    id: null,
    path: 'x',
    direction: -1,
    initialStart: [1000, 500]
  },
  3: {
    color: '#4286f4',
    lives: 20,
    id: null,
    path: 'y',
    direction: -1,
    initialStart: [500, 1000]
  },
  4: {
    color: '#4286f4',
    lives: 20,
    id: null,
    path: 'x',
    direction: 1,
    initialStart: [0, 500]
  }
};
