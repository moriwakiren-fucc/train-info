const board = [];
const boardElement = document.getElementById("board");
const turnText = document.getElementById("turn");
const resultText = document.getElementById("result");

let currentPlayer = "black";

const directions = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1]
];

function initBoard() {
  boardElement.innerHTML = "";

  for (let y = 0; y < 8; y++) {
    board[y] = [];
    for (let x = 0; x < 8; x++) {
      board[y][x] = null;

      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener("click", handleClick);

      boardElement.appendChild(cell);
    }
  }

  board[3][3] = "white";
  board[3][4] = "black";
  board[4][3] = "black";
  board[4][4] = "white";

  render();
}

function handleClick(e) {
  const x = Number(e.currentTarget.dataset.x);
  const y = Number(e.currentTarget.dataset.y);

  if (board[y][x] !== null) return;
  if (!canPut(x, y, currentPlayer)) return;

  board[y][x] = currentPlayer;
  reverseStones(x, y, currentPlayer);

  // ← ★ 追加：全消滅チェック
  if (checkAllOneColor()) {
    endGame();
    return;
  }

  if (hasAnyMove(opponent())) {
    currentPlayer = opponent();
  }

  if (!hasAnyMove("black") && !hasAnyMove("white")) {
    endGame();
    return;
  }

  turnText.textContent =
    currentPlayer === "black" ? "黒の番です" : "白の番です";

  render();
}

function opponent() {
  return currentPlayer === "black" ? "white" : "black";
}

function render() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.innerHTML = "";
    const x = cell.dataset.x;
    const y = cell.dataset.y;
    if (board[y][x]) {
      const stone = document.createElement("div");
      stone.className = `stone ${board[y][x]}`;
      cell.appendChild(stone);
    }
  });
}

function canPut(x, y, color) {
  return directions.some(([dx, dy]) => {
    let nx = x + dx;
    let ny = y + dy;
    let foundOpponent = false;

    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      if (board[ny][nx] === null) return false;
      if (board[ny][nx] !== color) {
        foundOpponent = true;
      } else {
        return foundOpponent;
      }
      nx += dx;
      ny += dy;
    }
    return false;
  });
}

function reverseStones(x, y, color) {
  directions.forEach(([dx, dy]) => {
    let nx = x + dx;
    let ny = y + dy;
    const toReverse = [];

    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
      if (board[ny][nx] === null) return;
      if (board[ny][nx] !== color) {
        toReverse.push([nx, ny]);
      } else {
        toReverse.forEach(([rx, ry]) => {
          board[ry][rx] = color;
        });
        return;
      }
      nx += dx;
      ny += dy;
    }
  });
}

function hasAnyMove(color) {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] === null && canPut(x, y, color)) {
        return true;
      }
    }
  }
  return false;
}

/* ★ 追加：盤面が全て同じ色かチェック */
function checkAllOneColor() {
  let black = 0;
  let white = 0;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] === "black") black++;
      if (board[y][x] === "white") white++;
    }
  }

  return black === 0 || white === 0;
}

function endGame() {
  let black = 0;
  let white = 0;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] === "black") black++;
      if (board[y][x] === "white") white++;
    }
  }

  let result = `黒：${black}個 / 白：${white}個<br>`;

  if (black > white) result += "🎉 黒の勝ち！";
  else if (white > black) result += "🎉 白の勝ち！";
  else result += "🤝 引き分け";

  turnText.textContent = "ゲーム終了";
  resultText.innerHTML = result;
}

initBoard();
