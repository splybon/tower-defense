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
export const PLAYER_STATS = {
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
