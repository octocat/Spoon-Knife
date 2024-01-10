const grid = document.getElementById('grid');
const status = document.getElementById('status');
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');

let currentPlayer = 'X';
let cellsFilled = 0;
let gameActive = true;
let board = ['', '', '', '', '', '', '', '', ''];
let winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Create grid cells
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('data-index', i);
  cell.addEventListener('click', cellClick);
  grid.appendChild(cell);
}

document.body.classList.add('colorful-background');


function cellClick(event) {
  const selectedIndex = event.target.getAttribute('data-index');

  if (board[selectedIndex] === '' && gameActive) {
    board[selectedIndex] = currentPlayer;
    event.target.textContent = currentPlayer;
    cellsFilled++;

    if (checkWin()) {
      status.textContent = `Player ${currentPlayer} wins!`;
      updateScore();
      gameActive = false;
    } else if (cellsFilled === 9) {
      status.textContent = 'It\'s a draw!';
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

function checkWin() {
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function updateScore() {
  if (currentPlayer === 'X') {
    playerXScore.textContent = parseInt(playerXScore.textContent) + 1;
  } else {
    playerOScore.textContent = parseInt(playerOScore.textContent) + 1;
  }
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  cellsFilled = 0;
  gameActive = true;
  status.textContent = `Player ${currentPlayer}'s turn`;

  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
  });
}

// ... (previous code remains unchanged)

let playerXScoreValue = 0;
let playerOScoreValue = 0;

function updateScore() {
  if (currentPlayer === 'X') {
    playerXScoreValue++;
    playerXScore.textContent = playerXScoreValue;
  } else {
    playerOScoreValue++;
    playerOScore.textContent = playerOScoreValue;
  }
}

function finishGame() {
  let result;
  if (checkWin()) {
    result = `Player ${currentPlayer} wins!`;
    updateScore();
  } else if (cellsFilled === 9) {
    result = 'It\'s a draw!';
  } else {
    result = `Game is still in progress. It's ${currentPlayer}'s turn.`;
    window.location.href = 'index.html';
    
  }

  // Redirect to a new page with the game result and scorecard in the URL query parameter
  window.location.href = `result.html?result=${encodeURIComponent(result)}&playerX=${playerXScoreValue}&playerO=${playerOScoreValue}`;
}
