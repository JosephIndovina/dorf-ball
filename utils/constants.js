
class Constants {
  static STORE_KEYS = {
    SLIPPI_DIR: 'slippi-dir',
    PLAYER1: 'player-1',
    PLAYER2: 'player-2',
    GANON: 'ganon'
  };

  static ACTION_STATES = {
    DEAD_DOWN: 0,
    DEAD_LEFT: 1,
    DEAD_RIGHT: 2
  };
}

// expose the class
module.exports = Constants;