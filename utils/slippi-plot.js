class SlippiPlot {
  constructor() { }

  static plot(id, score, x, y, PLAYER1, PLAYER2) {
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
      title: getTitle(),
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: {
        family: "'Roboto', sans-serif",
        color: 'rgb(255,255,255)'
      }, 
      titlefont: {
        size: 20
      },
      xaxis: {
        title: 'Time (seconds)'
      },
      yaxis: {
        title: 'Score'
      }
    }
    Plotly.newPlot(id, [line1, line2], layout)
  }
}

module.exports = SlippiPlot;