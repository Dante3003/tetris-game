import { I, J, L, O, S, T, Z } from './tetrominoes.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ROW = 20;
const COLUMN = 10;
const SQ = 20;
const VACANT = 'white';
const PIECES = [
  [Z, 'red'],
  [S, 'green'],
  [T, 'yellow'],
  [O, 'blue'],
  [L, 'purple'],
  [I, 'cyan'],
  [J, 'orange'],
]
let score = 0;


function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

  ctx.StrokeStyle = 'Black';
  ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}
let board = []

for (let r = 0; r < ROW; r += 1) {
  board[r] = [];
  for (let c = 0; c < COLUMN; c += 1) {
    board[r][c] = VACANT;
  }
}

function drawBoard() {
  for (let r = 0; r < ROW; r += 1) {
    for (let c = 0; c < COLUMN; c += 1) {
      drawSquare(c, r, board[r][c])
    }
  }
}

function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;
  this.tetrominoN = 0;
  this.activeTetromino = this.tetromino[this.tetrominoN];
  this.x = 3;
  this.y = -2;
}
Piece.prototype.fill = function (color) {
  for (let r = 0; r < this.activeTetromino.length; r += 1) {
    for (let c = 0; c < this.activeTetromino.length; c += 1) {
      if (this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, color)
      }
    }
  }
}
Piece.prototype.draw = function () {
  this.fill(this.color);
}
Piece.prototype.undraw = function () {
  this.fill(VACANT);
}
Piece.prototype.moveDown = function () {
  if (!this.collision(0, 1, this.activeTetromino)) {
    this.undraw();
    this.y++;
    this.draw();
  } else {
    this.lock();
    p = randomPiece()
  }
}
Piece.prototype.moveRight = function () {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.undraw();
    this.x++;
    this.draw();
  }
}
Piece.prototype.moveLeft = function () {
  if (!this.collision(-1, 0, this.activeTetromino)) {
    this.undraw();
    this.x--;
    this.draw();
  }
}
Piece.prototype.rotate = function () {
  let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
  let kick = 0;
  if (this.collision(0, 0, nextPattern)) {
    if (this.x > COLUMN / 2) {
      kick = -1;
    } else {
      kick = 1;
    }
  }
  if (!this.collision(kick, 0, nextPattern)) {
    this.undraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
}
Piece.prototype.lock = function () {
  for (let r = 0; r < this.activeTetromino.length; r += 1) {
    for (let c = 0; c < this.activeTetromino.length; c += 1) {
      if (!this.activeTetromino[r][c]) {
        continue;
      }
      if (this.y + r < 0) {
        alert('Game Over');
        gameOver = true;
        break;
      }
      board[this.y + r][this.x + c] = this.color;
    }
  }
  for (let r = 0; r < ROW; r++) {
    let isRowFull = true;
    for (let c = 0; c < COLUMN; c++) {
      isRowFull = isRowFull && (board[r][c] !== VACANT);
    }
    if (isRowFull) {
      for (let y = r; y > 1; y--) {
        for (let c = 0; c < COLUMN; c++) {
          board[y][c] = board[y-1][c]
        }   
      }
      for (let c = 0; c < COLUMN; c++) {
        board[0][c] = VACANT;
      }
      score += 10;
    }
  }
  drawBoard();
}
Piece.prototype.collision = function (x, y, piece) {
  for (let r = 0; r < piece.length; r += 1) {
    for (let c = 0; c < piece.length; c += 1) {
      if (!piece[r][c]) {
        continue;
      }
      let newX = this.x + c + x;
      let newY = this.y + r + y;
      if (newX < 0 || newX >= COLUMN || newY >= ROW) {
        return true;
      }
      if (newY < 0) {
        continue;
      }
      if (board[newY][newX] != VACANT) {
        return true;
      }
    }
  }
  return false;
}
drawBoard();

function randomPiece() {
  let randomN = Math.floor(Math.random() * PIECES.length)
  console.log(randomN)
  return new Piece(PIECES[randomN][0], PIECES[randomN][1])
}

let p = randomPiece()
p.draw()

function Control(event) {
  let events = {
    37: () => {
      loopStart = Date.now();
      p.moveLeft()
    },
    38: () => {
      loopStart = Date.now();
      p.rotate()
    },
    39: () => {
      loopStart = Date.now();
      p.moveRight()
    },
    40: () => {
      loopStart = Date.now();
      p.moveDown()
    },
  }
  if (event.keyCode in events) {
    events[event.keyCode]();
  }
}

document.addEventListener('keydown', Control)

let loopStart = Date.now();
let gameOver = false;
function gameLoop() {
  let now = Date.now();
  let delta = now - loopStart;
  if (delta > 1000) {
    p.moveDown();
    loopStart = Date.now();
  }


  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}
gameLoop()



























