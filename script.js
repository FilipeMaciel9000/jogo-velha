document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const statusDisplay = document.getElementById('status');
  const scoreX = document.getElementById('score-x');
  const scoreO = document.getElementById('score-o');
  const scoreDraw = document.getElementById('score-draw');
  const restartButton = document.getElementById('restart');
  const resetButton = document.getElementById('reset');
  const cells = document.querySelectorAll('.cell');
  const modeButtons = document.querySelectorAll('.mode-btn');

  // Variáveis do jogo
  let gameActive = true;
  let currentPlayer = 'X';
  let gameState = ['', '', '', '', '', '', '', '', ''];
  let gameMode = 'pvp'; // pvp (Player vs Player) ou pvc (Player vs Computer)
  let scores = {
    X: 0,
    O: 0,
    draw: 0,
  };

  // Mensagens do jogo
  const winMessage = () => `Jogador ${currentPlayer} venceu!`;
  const drawMessage = () => `Empate!`;
  const currentPlayerTurn = () => `Vez do jogador: ${currentPlayer}`;

  // Atualizar status
  statusDisplay.innerHTML = currentPlayerTurn();

  // Combinações vencedoras
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // linhas
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // colunas
    [0, 4, 8],
    [2, 4, 6], // diagonais
  ];

  // Manipular clique na célula
  function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(
      clickedCell.getAttribute('data-cell-index')
    );

    // Verificar se a célula já foi preenchida ou se o jogo não está ativo
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
      return;
    }

    // Processar jogada
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    // Se for modo PvC e o jogo ainda estiver ativo, fazer jogada do computador
    if (gameMode === 'pvc' && gameActive && currentPlayer === 'O') {
      setTimeout(makeComputerMove, 500); // Pequeno atraso para parecer mais natural
    }
  }

  // Fazer jogada do computador
  function makeComputerMove() {
    // Encontrar células vazias
    const emptyCells = gameState
      .map((cell, index) => (cell === '' ? index : null))
      .filter((cell) => cell !== null);

    if (emptyCells.length === 0) return;

    // Escolher uma célula aleatória
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cellIndex = emptyCells[randomIndex];

    // Fazer a jogada
    const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);
    handleCellPlayed(cell, cellIndex);
    handleResultValidation();
  }

  // Processar jogada
  function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
  }

  // Validar resultado
  function handleResultValidation() {
    let roundWon = false;

    // Verificar combinações vencedoras
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
        continue;
      }
      if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
        roundWon = true;
        break;
      }
    }

    // Se houver vencedor
    if (roundWon) {
      statusDisplay.innerHTML = winMessage();
      gameActive = false;
      scores[currentPlayer]++;
      updateScores();
      highlightWinningCells();
      return;
    }

    // Verificar empate
    let roundDraw = !gameState.includes('');
    if (roundDraw) {
      statusDisplay.innerHTML = drawMessage();
      gameActive = false;
      scores.draw++;
      updateScores();
      return;
    }

    // Mudar jogador
    handlePlayerChange();
  }

  // Mudar jogador
  function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = currentPlayerTurn();
  }

  // Destacar células vencedoras
  function highlightWinningCells() {
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (
        gameState[a] !== '' &&
        gameState[a] === gameState[b] &&
        gameState[b] === gameState[c]
      ) {
        document
          .querySelector(`[data-cell-index="${a}"]`)
          .classList.add('winner');
        document
          .querySelector(`[data-cell-index="${b}"]`)
          .classList.add('winner');
        document
          .querySelector(`[data-cell-index="${c}"]`)
          .classList.add('winner');
        break;
      }
    }
  }

  // Atualizar placar
  function updateScores() {
    scoreX.textContent = scores['X'];
    scoreO.textContent = scores['O'];
    scoreDraw.textContent = scores['draw'];
  }

  // Reiniciar partida
  function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = currentPlayerTurn();

    cells.forEach((cell) => {
      cell.classList.remove('x');
      cell.classList.remove('o');
      cell.classList.remove('winner');
    });

    // Se for modo PvC e o computador começar (O)
    if (gameMode === 'pvc' && currentPlayer === 'O') {
      setTimeout(makeComputerMove, 500);
    }
  }

  // Zerar placar
  function resetScores() {
    scores = {
      X: 0,
      O: 0,
      draw: 0,
    };
    updateScores();
    restartGame();
  }

  // Alterar modo de jogo
  function changeGameMode(mode) {
    gameMode = mode;
    restartGame();

    // Atualizar botões de modo
    modeButtons.forEach((btn) => {
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Event listeners
  cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
  restartButton.addEventListener('click', restartGame);
  resetButton.addEventListener('click', resetScores);

  // Event listeners para os botões de modo
  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      changeGameMode(button.dataset.mode);
    });
  });
});
