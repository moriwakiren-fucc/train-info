const board = [];
const boardElement = document.getElementById("board");
const turnText = document.getElementById("turn");

let currentPlayer = "black";

function initBoard() {
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

  currentPlayer = currentPlayer === "black" ? "white" : "black";
  turnText.textContent = currentPlayer === "black" ? "黒の番です" : "白の番です";

  render();
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

const directions = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1]
];

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

initBoard();
