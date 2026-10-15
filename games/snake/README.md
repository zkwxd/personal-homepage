# 🐍 Snake Game

**Classic. Fun. Addictive. A canvas-based Snake game with a slick neon UI, persistent high score, and full keyboard + touch controls.**

A polished take on the arcade classic: steer the snake to eat apples, grow longer, and go faster as your score climbs — all rendered on an HTML5 `<canvas>` with a retro-terminal green aesthetic.

<p>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-brightgreen">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue">
  <img alt="Client-side only" src="https://img.shields.io/badge/runs-100%25%20client--side-8bc63f">
</p>

---

## ✨ Features

- **Classic grid-based gameplay** — a 20×20 grid, canvas-rendered, with a snake that grows every time it eats an apple.
- **Full keyboard controls** — arrow keys or WASD to steer, Space to start, R to restart.
- **Touch / swipe support** — on mobile, swipe on the board in any direction to steer the snake.
- **Progressive difficulty** — the snake speeds up every 50 points, down to a minimum tick rate, keeping later rounds more challenging.
- **Persistent high score** — your best score is saved to `localStorage` and displayed alongside your current score, surviving page reloads.
- **Directional eyes** — the snake's head visually faces the direction it's currently moving.
- **Collision detection** — wall collisions and self-collisions both end the round immediately.
- **Clear game states** — a "Ready to play?" start overlay and a "Game Over" overlay (with your final score) each with their own call-to-action button.
- **Live stat chips** — score, control hints, restart key, and best score are always visible above the board.
- **Neon retro design** — a dark, grid-lined panel with glowing green accents, built with Bebas Neue and Manrope.
- **No backend, no build step** — plain HTML/CSS/JS; the only persistence is your own browser's local storage.

## 🖥️ Preview

<p align="center">
  <img src="screenshots/start-screen.png" alt="Snake Game start overlay, ready to play" width="480">
</p>

<p align="center">
  <img src="screenshots/gameplay.png" alt="Snake Game mid-round gameplay with the snake and an apple on the board" width="480">
</p>

<p align="center">
  <img src="screenshots/game-over.png" alt="Snake Game over overlay showing the final score" width="480">
</p>

## 🚀 Getting Started

This is a single self-contained web page — no build step, no package installation.

### Option 1: Open directly
```bash
git clone https://github.com/wasay-khanzada/Snake-Game.git
cd Snake-Game
open index.html   # macOS
# or just double-click index.html on Windows/Linux
```

### Option 2: Serve locally
```bash
npx serve .
# or
python3 -m http.server 8000
```
Then visit `http://localhost:PORT`.

### Option 3: GitHub Pages
Enable GitHub Pages on the `main` branch (root) in the repository settings for a live, shareable link.

## 📝 Usage

1. Press **Space** (or tap **Press Space to Start**) to begin.
2. Steer with the **arrow keys** or **WASD** — on mobile, swipe on the board instead.
3. Eat apples to grow and score points; avoid hitting the walls or your own tail.
4. On **Game Over**, press **R** (or tap **Press R to Restart**) to play again — your high score is preserved.

## 🛠️ Tech Stack

- HTML5 & CSS3 (no frameworks) — Bebas Neue (display) and Manrope (body) via Google Fonts
- Vanilla JavaScript (no libraries) — game loop via `setInterval`, all rendering via the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- `localStorage` for high-score persistence
- No external APIs, no build tools

## 📁 Project Structure

```
Snake-Game/
├── index.html   # markup and structure
├── style.css    # neon design system and layout
└── script.js    # game loop, rendering, input handling, and scoring
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## 🙋 Author

**Abdul Wasay Khan**
[Portfolio](https://abdul-wasay-khan-portfolio.netlify.app) · [GitHub](https://github.com/wasay-khanzada)

---

If you find this game fun, consider giving the repo a ⭐ — it helps others find it too.
