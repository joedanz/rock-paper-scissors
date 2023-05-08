const socket = io();
const playerName = document.getElementById('playerName');
const rock = document.getElementById('rock');
const paper = document.getElementById('paper');
const scissors = document.getElementById('scissors');

rock.addEventListener('click', () => makeChoice('rock'));
paper.addEventListener('click', () => makeChoice('paper'));
scissors.addEventListener('click', () => makeChoice('scissors'));

function makeChoice(choice) {
  const player = playerName.value.trim();

  if (!player) {
    alert('Please enter your name.');
    return;
  }

  socket.emit('choice', { player, choice });
}

socket.on('result', (data) => {
  alert(data.message);
});