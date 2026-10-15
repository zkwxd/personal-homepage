/* ---------------------------------------------------------------
   Snake Game
   Classic grid-based snake built with the canvas API. Demonstrates
   game-loop timing, keyboard event handling, collision detection,
   and DOM updates for score / game state.
--------------------------------------------------------------- */

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 20;
const CELL = canvas.width / GRID_SIZE;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const finalScoreEl = document.getElementById("final-score");
const startOverlay = document.getElementById("start-overlay");
const overOverlay = document.getElementById("over-overlay");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const COLORS = {
  gridA: "#0E141B",
  gridB: "#111922",
  snakeHead: "#C6F24E",
  snakeBody: "#8BC63F",
  snakeBodyAlt: "#4C8A1E",
  eye: "#0A0E13",
  apple: "#E4402D",
  appleShine: "#FF8A73",
  leaf: "#4C8A1E",
};

const HIGH_SCORE_KEY = "snakeHighScore";

let snake, direction, nextDirection, food, score, tickRate, timerId, running;

function loadHighScore() {
  // Local integration: sandboxed embeds may not allow storage.
  try { return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0", 10) || 0; }
  catch { return Number(highScoreEl.textContent) || 0; }
}

function saveHighScoreIfNeeded() {
  const best = loadHighScore();
  if (score > best) {
    try { localStorage.setItem(HIGH_SCORE_KEY, String(score)); } catch { /* Session-only best score. */ }
  }
  highScoreEl.textContent = Math.max(best, score);
}

function randomCell() {
  let cell;
  do {
    cell = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((seg) => seg.x === cell.x && seg.y === cell.y));
  return cell;
}

function resetState() {
  snake = [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  tickRate = 130;
  food = randomCell();
  scoreEl.textContent = score;
}

function startGame() {
  startOverlay.classList.remove("visible");
  overOverlay.classList.remove("visible");
  resetState();
  running = true;
  clearInterval(timerId);
  timerId = setInterval(tick, tickRate);
  draw();
}

function endGame() {
  running = false;
  clearInterval(timerId);
  saveHighScoreIfNeeded();
  finalScoreEl.textContent = score;
  overOverlay.classList.add("visible");
}

function tick() {
  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  const hitWall =
    head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
  const hitSelf = snake.some((seg) => seg.x === head.x && seg.y === head.y);

  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    // Local integration: a full board is a completed game, not an endless food search.
    if (snake.length === GRID_SIZE * GRID_SIZE) {
      overOverlay.querySelector(".overlay-title").textContent = "恭喜通关！";
      draw();
      endGame();
      return;
    }
    food = randomCell();

    if (score % 50 === 0 && tickRate > 70) {
      tickRate -= 8;
      clearInterval(timerId);
      timerId = setInterval(tick, tickRate);
    }
  } else {
    snake.pop();
  }

  draw();
}

function drawGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? COLORS.gridA : COLORS.gridB;
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
  }
}

function drawFood() {
  const cx = food.x * CELL + CELL / 2;
  const cy = food.y * CELL + CELL / 2;
  const r = CELL * 0.36;

  ctx.fillStyle = COLORS.apple;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.appleShine;
  ctx.beginPath();
  ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.32, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = COLORS.leaf;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + 2, cy - r);
  ctx.lineTo(cx + 2, cy - r - 5);
  ctx.stroke();

  ctx.fillStyle = COLORS.leaf;
  ctx.beginPath();
  ctx.ellipse(cx + 6, cy - r - 5, 4, 2.4, 0.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawSnake() {
  snake.forEach((seg, i) => {
    const x = seg.x * CELL;
    const y = seg.y * CELL;
    const pad = 1.5;

    ctx.fillStyle =
      i === 0
        ? COLORS.snakeHead
        : i % 2 === 0
          ? COLORS.snakeBody
          : COLORS.snakeBodyAlt;
    roundRect(x + pad, y + pad, CELL - pad * 2, CELL - pad * 2, 5);
    ctx.fill();

    if (i === 0) {
      drawEyes(x, y);
    }
  });
}

function drawEyes(x, y) {
  const offsets = {
    "1,0": [
      [CELL * 0.62, CELL * 0.3],
      [CELL * 0.62, CELL * 0.7],
    ],
    "-1,0": [
      [CELL * 0.38, CELL * 0.3],
      [CELL * 0.38, CELL * 0.7],
    ],
    "0,1": [
      [CELL * 0.3, CELL * 0.62],
      [CELL * 0.7, CELL * 0.62],
    ],
    "0,-1": [
      [CELL * 0.3, CELL * 0.38],
      [CELL * 0.7, CELL * 0.38],
    ],
  };
  const key = `${direction.x},${direction.y}`;
  const pair = offsets[key] || offsets["1,0"];

  ctx.fillStyle = COLORS.eye;
  pair.forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, CELL * 0.09, 0, Math.PI * 2);
    ctx.fill();
  });
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function draw() {
  drawGrid();
  drawFood();
  drawSnake();
}

function setDirection(x, y) {
  if (direction.x === -x && direction.y === -y) return; // no instant reverse
  nextDirection = { x, y };
}

function handleKey(e) {
  const key = e.key;
  const moveKeys = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "w",
    "a",
    "s",
    "d",
    "W",
    "A",
    "S",
    "D",
  ];
  if (moveKeys.includes(key) || key === " ") e.preventDefault();

  if (!running) {
    if (key === " " && startOverlay.classList.contains("visible")) {
      startGame();
      return;
    }
    if (
      (key === "r" || key === "R") &&
      overOverlay.classList.contains("visible")
    ) {
      startGame();
      return;
    }
    return;
  }

  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      setDirection(0, -1);
      break;
    case "ArrowDown":
    case "s":
    case "S":
      setDirection(0, 1);
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      setDirection(-1, 0);
      break;
    case "ArrowRight":
    case "d":
    case "D":
      setDirection(1, 0);
      break;
    case "r":
    case "R":
      startGame();
      break;
  }
}

// touch swipe support
let touchStart = null;
canvas.addEventListener(
  "touchstart",
  (e) => {
    const t = e.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  },
  { passive: true },
);

canvas.addEventListener(
  "touchend",
  (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;

    if (!running) {
      startGame();
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection(dx > 0 ? 1 : -1, 0);
    } else {
      setDirection(0, dy > 0 ? 1 : -1);
    }
    touchStart = null;
  },
  { passive: true },
);

document.addEventListener("keydown", handleKey);
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

// initial paint before the first game starts
snake = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];
direction = { x: 1, y: 0 };
food = randomCell();
running = false;
highScoreEl.textContent = loadHighScore();
draw();
