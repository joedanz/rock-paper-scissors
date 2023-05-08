const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const players = {};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Handle the player's choice
  socket.on('choice', (data) => {
    console.log('user choice', data);
    players[socket.id] = data;

    console.log('players', Object.keys(players).length)

    // Check if both players have made a choice
    if (Object.keys(players).length === 2) {
      const playerIDs = Object.keys(players);
      const player1 = players[playerIDs[0]];
      const player2 = players[playerIDs[1]];
      const winner = determineWinner(player1.choice, player2.choice);

      if (winner === 'tie') {
        io.emit('result', { winner: 'tie', message: 'It\'s a tie!' });
      } else {
        const winningPlayer = winner === player1.choice ? player1 : player2;
        io.emit('result', { winner: winningPlayer.player, message: `${winningPlayer.player} wins!` });
      }

      // Reset the game
      Object.keys(players).forEach(key => delete players[key]);
    }
  });
});

function determineWinner(choice1, choice2) {
  if (choice1 === choice2) {
    return 'tie';
  }

  if (
    (choice1 === 'rock' && choice2 === 'scissors') ||
    (choice1 === 'paper' && choice2 === 'rock') ||
    (choice1 === 'scissors' && choice2 === 'paper')
  ) {
    return choice1;
  }

  return choice2;
}


http.listen(3000, () => {
  console.log('listening on *:3000');
});
