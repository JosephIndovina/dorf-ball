const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;
const { default: SlippiGame } = require('slp-parser-js');
const path = require('path');
const fs = require('fs');
const plot = require('nodeplotlib');

let SLIPPI_DIR;
let PLAYER1 = 0;
let PLAYER2 = 1;
let GANON = 3;
const ACTION_STATES = {
  DEAD_DOWN: 0,
  DEAD_LEFT: 1,
  DEAD_RIGHT: 2
}

function play() {
  fs.readdir(SLIPPI_DIR, (error, files) => {
    const filePath = SLIPPI_DIR + '/' + files.sort().reverse()[0];
    const game = new SlippiGame(filePath);
    const frames = game.getFrames();
    const metadata = game.getMetadata();

    let x = [[],[]], y = [[],[]];
    let score = [0,0];

    const getTime = (frame) => {
      return frame/60;
    }

    const setScore = (player, frame) => {
      score[player]++;
      x[player].push(getTime(frame));
      y[player].push(score[player]);
    };

    for(let frame = 0; frame < metadata.lastFrame; frame++) {
      const state = frames[frame].players[GANON].post;

      // Check state on the frame that the player died 
      if (Object.values(ACTION_STATES).includes(state.actionStateId)) {
        const position = state.positionX;
        setScore(position < 0 ? PLAYER1 : PLAYER2, frame);
        // Each death animation lasts 60 frames
        frame += 60;
      }
    }

    const getTitle = () => {
      if (score[PLAYER1] === score[PLAYER2]) {
        return 'It\'s a tie!';
      } else {
        return 'Player ' + (score[PLAYER1] > score[PLAYER2] ? '1' : '2') + ' wins!';
      }
    };

    const line1 = {
      x: x[PLAYER1], 
      y: y[PLAYER1], 
      type: 'line', 
      name: 'Player 1',   
      marker: {
        color: 'rgb(255, 0, 0)',
        size: 12
      }
    };
    const line2 = {
      x: x[PLAYER2], 
      y: y[PLAYER2], 
      type: 'line', 
      name: 'Player 2',
      marker: {
        color: 'rgb(0, 0, 255)',
        size: 12
      }
    };
    const layout = {
      title:  getTitle(),
      titlefont: {
        size: 20
      },
      xaxis: {
        title: 'Time (seconds)'
      },
      yaxis: {
        title: 'Score'
      },
      annotations: [
        {
          x: x[PLAYER1][score[PLAYER1]-1],
          y: score[PLAYER1],
          xref: 'x',
          yref: 'y',
          text: 'Score: ' + score[PLAYER1],
          showarrow: true,
          arrowhead: 7,
          ax: 0,
          ay: -40,
          font: {
            size: 14
          },
        },
        {
          x: x[PLAYER2][score[PLAYER2]-1],
          y: score[PLAYER2],
          xref: 'x',
          yref: 'y',
          text: 'Score: ' + score[PLAYER2],
          showarrow: true,
          arrowhead: 7,
          ax: 0,
          ay: -40,
          font: {
            size: 14
          },
        }
      ]
    }
    //plot.plot([line1, line2], layout);
  });
}

function showDialog() {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then((dir) => {
    SLIPPI_DIR = path.join(dir.filePaths[0]);
  });
}

document.querySelector('#choose-directory-btn').addEventListener('click', () => {
  showDialog();
});