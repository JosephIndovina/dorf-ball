const { dialog } = require('electron').remote;
const { default: SlippiGame } = require('slp-parser-js');
const path = require('path');
const fs = require('fs');
const Store = require('./utils/store.js');
const Constants = require('./utils/constants.js');
const SlippiPlot = require('./utils/slippi-plot.js');

const STORE_KEYS = Constants.STORE_KEYS;
const ACTION_STATES = Constants.ACTION_STATES;
const store = new Store({
  configName: 'dorf-ball',
  defaults: {
    'slippi-dir': 'C:/',
    'player-1': 0,
    'player-2': 1,
    'ganon': 3
  }
});

function process() {
  const SLIPPI_DIR = store.get(STORE_KEYS.SLIPPI_DIR);
  const PLAYER1 = store.get(STORE_KEYS.PLAYER1);
  const PLAYER2 = store.get(STORE_KEYS.PLAYER2);
  const GANON = store.get(STORE_KEYS.GANON);

  fs.readdir(SLIPPI_DIR, (error, files) => {
    const filePath = SLIPPI_DIR + '\\' + files.sort().reverse()[0];
    const game = new SlippiGame(filePath);
    const frames = game.getFrames();
    const metadata = game.getMetadata();

    let x = [[], []], y = [[], []];
    let score = [0, 0];

    const getTime = (frame) => {
      return frame / 60;
    }

    const setScore = (player, frame) => {
      score[player]++;
      x[player].push(getTime(frame));
      y[player].push(score[player]);
    };

    for (let frame = 0; frame < metadata.lastFrame; frame++) {
      const state = frames[frame].players[GANON].post;

      // Check state on the frame that the player died 
      if (Object.values(ACTION_STATES).includes(state.actionStateId)) {
        const position = state.positionX;
        setScore(position < 0 ? PLAYER1 : PLAYER2, frame);
        // Each death animation lasts 60 frames
        frame += 60;
      }
    }
    SlippiPlot.plot('plot', score, x, y, PLAYER1, PLAYER2);
  });
}

function setSlippiDirectory() {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then((dir) => {
    store.set(STORE_KEYS.SLIPPI_DIR, path.join(dir.filePaths[0]));
  });
}

function setPorts() {
  store.set(STORE_KEYS.PLAYER1, document.getElementById('player1-port').value - 1);
  store.set(STORE_KEYS.PLAYER2, document.getElementById('player2-port').value - 1);
  store.set(STORE_KEYS.GANON, document.getElementById('ganon-port').value - 1);
}

function setEventListeners() {
  document.querySelector('#choose-directory-btn').addEventListener('click', () => {
    setSlippiDirectory();
  }); document.querySelector('#process-btn').addEventListener('click', () => {
    process();
  });
  document.querySelector('input').addEventListener('change', () => {
    setPorts();
  })
}

function dorf() {
  // On Init
  setEventListeners();
}

dorf();