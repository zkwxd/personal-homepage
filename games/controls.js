/* Embedding adapter, not game rules. Upstream authors are credited below. */
(() => {
  const game = document.documentElement.dataset.game;
  const snake = game === "snake";
  const codes = { ArrowUp: 38, ArrowLeft: 37, ArrowDown: 40, ArrowRight: 39 };
  function arrow(key) {
    document.dispatchEvent(new KeyboardEvent("keydown", { key, keyCode: codes[key], which: codes[key], bubbles: true }));
  }
  const controls = document.createElement("div");
  controls.className = "game-controls";
  const pad = document.createElement("div");
  pad.className = "direction-pad";
  pad.setAttribute("role", "group");
  pad.setAttribute("aria-label", "游戏方向按钮");
  [["ArrowUp", "↑", "向上"], ["ArrowLeft", "←", "向左"], ["ArrowDown", "↓", "向下"], ["ArrowRight", "→", "向右"]].forEach(([key, symbol, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = symbol;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", () => arrow(key));
    pad.append(button);
  });
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "game-reset";
  reset.textContent = "重新开始";
  reset.addEventListener("click", () => location.reload());
  controls.append(pad, reset);
  document.body.append(controls);
  const credit = document.createElement("p");
  credit.className = "game-credit";
  const source = snake ? "https://github.com/wasay-khanzada/Snake-Game" : "https://gist.github.com/straker/2fddb507d4bb6bec54ea2fdb022d020c";
  const link = document.createElement("a");
  link.href = source;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = snake ? "Abdul Wasay Khan · MIT · 原作者源码" : "Steven Lambert (straker) · CC0 · 原作者源码";
  credit.append(window.parent === window ? link : document.createTextNode(link.textContent), document.createTextNode(" · 本站适配"));
  document.body.append(credit);
  document.addEventListener("keydown", (event) => {
    if (event.key.startsWith("Arrow")) event.preventDefault();
    if (!snake) {
      const mapped = { w: "ArrowUp", a: "ArrowLeft", s: "ArrowDown", d: "ArrowRight" }[event.key.toLowerCase()];
      if (mapped) { event.preventDefault(); arrow(mapped); }
    }
    if (event.key === "Escape" && window.parent !== window) parent.postMessage({ type: "close-game" }, "*");
  });
})();
