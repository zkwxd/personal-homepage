/* Personal Space v2 — independent views and local interactive scenes. */
(() => {
  "use strict";
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const root = document.documentElement;
  const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const chapters = ["about", "algorithm", "life", "lab", "contact"];
  const labels = { welcome: "返回入口", about: "关于我", algorithm: "算法之路", life: "生活切片", lab: "探索实验室", contact: "建立连接" };
  const legacyRoutes = { home: "welcome", algo: "algorithm", skills: "algorithm", projects: "lab", updates: "life" };
  const readPreference = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Reading needs no storage. */ } };
  let activeScreen = "welcome";
  let paused = readPreference("space-motion") === "paused";
  let toastTimer;
  let viewAnimation = null;
  let navigationToken = 0;

  function toast(message) {
    const element = $("#toast");
    clearTimeout(toastTimer);
    element.textContent = message;
    element.classList.add("is-visible");
    toastTimer = setTimeout(() => element.classList.remove("is-visible"), 3200);
  }
  function applyTheme(theme) {
    root.dataset.theme = theme;
    $("#themeBtn").setAttribute("aria-label", theme === "dark" ? "切换浅色主题" : "切换深色主题");
    $('meta[name="theme-color"]').content = theme === "dark" ? "#080c10" : "#f0f4f3";
    drawOrbit();
  }
  // Deliberate dark default, preserving the visitor's previous explicit choice.
  root.dataset.theme = readPreference("site-theme") === "light" ? "light" : "dark";
  $("#themeBtn").addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    savePreference("site-theme", theme);
  });

  /* Hash routes work with direct links, refresh, back/forward and file://. */
  function getRoute() {
    const hash = location.hash.slice(1).replace(/^\//, "");
    const route = legacyRoutes[hash] || hash || "welcome";
    return route === "welcome" || chapters.includes(route) ? route : "welcome";
  }
  function renderRoute(shouldFocus = false) {
    const next = getRoute();
    if ($("#gameDialog").open) $("#gameDialog").close();
    if (activeScreen === "algorithm" && next !== "algorithm") cancelSearch();
    activeScreen = next;
    const screen = document.getElementById(next);
    $$("[data-screen]").forEach((element) => {
      const active = element === screen;
      element.hidden = !active;
      element.classList.toggle("is-active", active);
    });
    $("#chapterShell").classList.toggle("is-open", next !== "welcome");
    $$(".header-nav a, .chapter-nav a, #chapterMenu nav a").forEach((link) => {
      if (link.getAttribute("href") === `#${next}`) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.title = next === "welcome" ? "我爱学习 · 探索我的世界" : `${labels[next]} · 我爱学习`;
    if (shouldFocus) {
      window.scrollTo({ top: 0, behavior: "instant" });
      $("h1", screen).focus({ preventScroll: true });
    }
    syncOrbitLoop();
  }
  async function navigate() {
    const token = ++navigationToken;
    viewAnimation?.cancel();
    viewAnimation = null;
    const main = $("#main");
    if (getRoute() === activeScreen || motionQuery.matches || paused || !main.animate) {
      renderRoute(true);
      return;
    }
    // Finish the outgoing view before replacing its content, then settle gently.
    viewAnimation = main.animate(
      [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-6px)" }],
      { duration: 140, easing: "ease-in", fill: "forwards" }
    );
    await viewAnimation.finished.catch(() => {});
    if (token !== navigationToken) return;
    viewAnimation.cancel();
    renderRoute(true);
    viewAnimation = main.animate(
      [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 340, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }
    );
    await viewAnimation.finished.catch(() => {});
    if (token === navigationToken) { viewAnimation.cancel(); viewAnimation = null; }
  }
  window.addEventListener("hashchange", navigate);
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.getAttribute("href") === "#main") {
      event.preventDefault();
      $("#main").focus();
      return;
    }
    if (link.closest("dialog")) link.closest("dialog").close();
    if (link.getAttribute("href") === location.hash || (!location.hash && link.getAttribute("href") === "#welcome")) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: motionQuery.matches || paused ? "instant" : "smooth" });
    }
  });

  /* Native dialogs contain focus and restore it when dismissed. */
  $("#menuBtn").addEventListener("click", () => $("#chapterMenu").showModal());
  $$("[data-avatar]").forEach((button) => button.addEventListener("click", () => $("#avatarDialog").showModal()));
  $$("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
  $$("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }));
  const games = {
    snake: { title: "贪吃蛇", path: "games/snake/index.html", source: "https://github.com/wasay-khanzada/Snake-Game" },
    sokoban: { title: "推箱子", path: "games/sokoban/index.html", source: "https://gist.github.com/straker/2fddb507d4bb6bec54ea2fdb022d020c" }
  };
  $$("[data-game]").forEach((link) => link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const game = games[link.dataset.game];
    if (!game) return;
    event.preventDefault();
    const frame = document.createElement("iframe");
    frame.id = "gameFrame";
    frame.title = `${game.title}小游戏`;
    frame.setAttribute("sandbox", "allow-scripts");
    frame.src = game.path;
    const wrapper = $("#gameFrameWrap");
    wrapper.setAttribute("aria-busy", "true");
    frame.addEventListener("load", () => {
      wrapper.setAttribute("aria-busy", "false");
      if ($("#gameDialog").open) frame.contentWindow.focus();
    });
    $("#gameFrameWrap").replaceChildren(frame);
    $("#gameTitle").textContent = game.title;
    $("#gameSourceLink").href = game.source;
    $("#gameStandalone").href = game.path;
    $("#gameDialog").showModal();
  }));
  $("#gameDialog").addEventListener("close", () => {
    $("#gameFrameWrap").replaceChildren();
    $("#gameFrameWrap").removeAttribute("aria-busy");
  });
  window.addEventListener("message", (event) => {
    if (event.source === $("#gameFrame")?.contentWindow && event.data?.type === "close-game") $("#gameDialog").close();
  });
  $("#copyEmail").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("2059913911@qq.com");
      toast("邮箱已复制，期待你的消息。");
    } catch {
      const selection = getSelection();
      const range = document.createRange();
      range.selectNodeContents($(".email-address"));
      selection.removeAllRanges();
      selection.addRange(range);
      toast("邮箱已选中，请长按或按 Ctrl/Cmd + C 复制。");
    }
  });
  const moods = {
    focus: "把大问题拆小，一步一步往前走。",
    move: "暂时离开屏幕，让身体带着心情动起来。",
    game: "学习先存个档，快乐打游戏。",
    rest: "今天先偷个懒，充满电再说。",
    zhou: "今日份快乐：和周哥贴贴。"
  };
  $$(".life-chip[data-mood]").forEach((button) => button.addEventListener("click", () => {
    $$(".life-chip[data-mood]").forEach((other) => {
      const selected = other === button;
      other.classList.toggle("is-selected", selected);
      other.setAttribute("aria-pressed", String(selected));
    });
    $("#moodOutput p").textContent = moods[button.dataset.mood];
    $(".sport-panel").dataset.mood = button.dataset.mood;
  }));
  const clockFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  function updateClock() {
    const now = new Date();
    $("#clock").textContent = clockFormat.format(now);
    $("#clock").dateTime = now.toISOString();
    $("#year").textContent = new Intl.DateTimeFormat("en", { timeZone: "Asia/Shanghai", year: "numeric" }).format(now);
  }
  updateClock();
  setInterval(() => { if (!document.hidden) updateClock(); }, 1000);

  /* Real breadth-first search, with editable obstacles and cancellable animation. */
  const columns = 8, rows = 6, start = 8, end = 39;
  const initialWalls = [3, 11, 19, 27, 28, 20, 36];
  const walls = new Set(initialWalls);
  const cells = [];
  let searchToken = 0, searching = false, pendingDelay = null, finishDelay = null;
  function paintGrid() {
    cells.forEach((cell, index) => {
      cell.className = "path-cell";
      if (index === start) cell.classList.add("is-start");
      else if (index === end) cell.classList.add("is-end");
      else if (walls.has(index)) cell.classList.add("is-wall");
      cell.setAttribute("aria-label", index === start ? "起点 S" : index === end ? "终点 E" : `第 ${Math.floor(index / columns) + 1} 行，第 ${index % columns + 1} 列，${walls.has(index) ? "障碍，点击移除" : "空地，点击添加障碍"}`);
      if (index !== start && index !== end) cell.setAttribute("aria-pressed", String(walls.has(index)));
    });
  }
  function setSearchState(busy) {
    searching = busy;
    $("#runPath").disabled = busy;
    cells.forEach((cell, index) => { cell.disabled = busy || index === start || index === end; });
  }
  function cancelSearch() {
    searchToken++;
    clearTimeout(pendingDelay);
    if (finishDelay) finishDelay();
    finishDelay = null;
    pendingDelay = null;
    if (searching) {
      setSearchState(false);
      paintGrid();
      $("#pathStatus").textContent = "READY / 演示已停止，可以重新运行。";
    }
  }
  function waitStep(milliseconds) {
    if (motionQuery.matches || paused) return Promise.resolve();
    return new Promise((resolve) => {
      finishDelay = resolve;
      pendingDelay = setTimeout(() => { pendingDelay = null; finishDelay = null; resolve(); }, milliseconds);
    });
  }
  for (let index = 0; index < columns * rows; index++) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = index === start ? "S" : index === end ? "E" : "";
    button.addEventListener("click", () => {
      if (searching || index === start || index === end) return;
      if (walls.has(index)) walls.delete(index); else walls.add(index);
      paintGrid();
      $("#pathStatus").textContent = "READY / 障碍已更新，点击运行重新探索。";
    });
    cells.push(button);
    $("#pathGrid").append(button);
  }
  paintGrid();
  setSearchState(false);
  $("#resetPath").addEventListener("click", () => {
    cancelSearch();
    walls.clear();
    initialWalls.forEach((wall) => walls.add(wall));
    paintGrid();
    $("#pathStatus").textContent = "READY / 已恢复初始地图，点击运行开始。";
  });
  $("#runPath").addEventListener("click", async () => {
    cancelSearch();
    paintGrid();
    const token = searchToken;
    setSearchState(true);
    $("#pathStatus").textContent = "SEARCHING / 正在逐层探索可达节点…";
    const queue = [start];
    const parent = new Map([[start, null]]);
    const explored = [];
    let found = false;
    for (let head = 0; head < queue.length; head++) {
      const current = queue[head];
      explored.push(current);
      if (current === end) { found = true; break; }
      const x = current % columns, y = Math.floor(current / columns);
      for (const [dx, dy] of [[1,0],[0,1],[-1,0],[0,-1]]) {
        const nx = x + dx, ny = y + dy, neighbor = ny * columns + nx;
        if (nx < 0 || nx >= columns || ny < 0 || ny >= rows || walls.has(neighbor) || parent.has(neighbor)) continue;
        parent.set(neighbor, current);
        queue.push(neighbor);
      }
    }
    for (const index of explored) {
      if (token !== searchToken) return;
      if (index !== start && index !== end) cells[index].classList.add("is-visited");
      await waitStep(32);
    }
    if (token !== searchToken) return;
    if (found) {
      const path = [];
      for (let index = end; index !== null; index = parent.get(index)) path.push(index);
      path.reverse();
      for (const index of path) {
        if (token !== searchToken) return;
        if (index !== start && index !== end) cells[index].classList.add("is-path");
        await waitStep(65);
      }
      if (token !== searchToken) return;
      $("#pathStatus").textContent = `FOUND / 最短路径 ${path.length - 1} 步 · 已探索 ${explored.length} 个节点。`;
    } else {
      $("#pathStatus").textContent = `NO PATH / 已探索 ${explored.length} 个节点，试试移除一些障碍。`;
    }
    setSearchState(false);
  });

  /* Projected 3D wireframe, entirely rendered on a local canvas. */
  const canvas = $("#orbitalCanvas");
  const context = canvas.getContext("2d");
  let width = 0, height = 0, frameId = 0, angle = .35;
  let previousTime = 0, lastDraw = 0, pointerX = 0, pointerY = 0;
  function project(x, y, z, rotation = angle) {
    const rotatedX = x * Math.cos(rotation) - z * Math.sin(rotation);
    const rotatedZ = x * Math.sin(rotation) + z * Math.cos(rotation);
    const tilt = -.3 + pointerY * .06;
    const tiltedY = y * Math.cos(tilt) - rotatedZ * Math.sin(tilt);
    const tiltedZ = y * Math.sin(tilt) + rotatedZ * Math.cos(tilt);
    const scale = 3.8 / (3.8 + tiltedZ);
    const radius = Math.min(width * .32, height * .34);
    return { x: width / 2 + rotatedX * radius * scale + pointerX * 5, y: height / 2 + tiltedY * radius * scale, z: tiltedZ };
  }
  function drawOrbit() {
    if (!context || !width || !height) return;
    const light = root.dataset.theme === "light";
    const color = light ? "8,119,93" : "123,245,208";
    const blue = light ? "32,109,168" : "101,175,216";
    context.clearRect(0,0,width,height);
    const radius = Math.min(width * .32,height * .34);
    const glow = context.createRadialGradient(width/2,height/2,5,width/2,height/2,radius*1.4);
    glow.addColorStop(0,`rgba(${color},.055)`);
    glow.addColorStop(1,`rgba(${color},0)`);
    context.fillStyle = glow;
    context.fillRect(0,0,width,height);
    function line(points, rgb, alpha = .23, lineWidth = .65) {
      context.strokeStyle = `rgba(${rgb},${alpha})`;
      context.lineWidth = lineWidth;
      context.beginPath();
      points.forEach((point,index) => index ? context.lineTo(point.x,point.y) : context.moveTo(point.x,point.y));
      context.stroke();
    }
    for (let longitude = 0; longitude < 16; longitude++) {
      const points = [], phi = longitude / 16 * Math.PI * 2;
      for (let step = 0; step <= 80; step++) {
        const theta = step / 80 * Math.PI;
        points.push(project(Math.sin(theta)*Math.cos(phi),Math.cos(theta),Math.sin(theta)*Math.sin(phi)));
      }
      line(points,blue,light ? .2 : .25);
    }
    for (let latitude = 1; latitude < 12; latitude++) {
      const points = [], theta = latitude / 12 * Math.PI;
      for (let step = 0; step <= 100; step++) {
        const phi = step / 100 * Math.PI * 2;
        points.push(project(Math.sin(theta)*Math.cos(phi),Math.cos(theta),Math.sin(theta)*Math.sin(phi)));
      }
      line(points,color,.24);
    }
    for (let ring = 0; ring < 2; ring++) {
      const points = [];
      for (let step = 0; step <= 140; step++) {
        const t = step / 140 * Math.PI * 2;
        points.push(project(1.42*Math.cos(t),Math.sin(t)*(ring ? .65 : -.5),Math.sin(t)*(ring ? .7 : .85),ring ? -.45 : .3));
      }
      line(points,ring ? blue : color,ring ? .3 : .55,ring ? .8 : 1);
    }
    // Deterministic nodes avoid random flicker across redraws.
    for (let i = 0; i < 30; i++) {
      const theta = Math.acos(1-2*(i+.5)/30), phi = i*2.399963;
      const point = project(Math.sin(theta)*Math.cos(phi),Math.cos(theta),Math.sin(theta)*Math.sin(phi));
      const front = point.z < .2;
      context.fillStyle = `rgba(${color},${front ? .9 : .25})`;
      context.beginPath();
      context.arc(point.x,point.y,front ? 2 : 1.3,0,Math.PI*2);
      context.fill();
      if (i % 7 === 0 && front) {
        context.strokeStyle = `rgba(${color},.3)`;
        context.lineWidth = .7;
        context.strokeRect(point.x-5,point.y-5,10,10);
      }
    }
    context.font = `500 ${Math.max(24,width*.065)}px Consolas, monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = `rgba(${color},.9)`;
    context.fillText("</>",width/2,height/2);
    const dot = project(1.42*Math.cos(angle*1.7),Math.sin(angle*1.7)*-.5,Math.sin(angle*1.7)*.85,.3);
    context.fillStyle = `rgba(${color},1)`;
    context.beginPath();
    context.arc(dot.x,dot.y,3.2,0,Math.PI*2);
    context.fill();
  }
  function resizeOrbit() {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    width = bounds.width;
    height = bounds.height;
    const dpr = Math.min(devicePixelRatio || 1,2);
    canvas.width = Math.round(width*dpr);
    canvas.height = Math.round(height*dpr);
    context?.setTransform(dpr,0,0,dpr,0,0);
    drawOrbit();
  }
  function animate(time) {
    frameId = 0;
    if (time-lastDraw >= 32) {
      angle += Math.min(time-(previousTime || time),64)*.00015;
      previousTime = time;
      lastDraw = time;
      drawOrbit();
    }
    frameId = requestAnimationFrame(animate);
  }
  function syncOrbitLoop() {
    const shouldRun = context && activeScreen === "welcome" && !document.hidden && !motionQuery.matches && !paused;
    if (shouldRun && !frameId) {
      resizeOrbit();
      previousTime = 0;
      frameId = requestAnimationFrame(animate);
    } else if (!shouldRun && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
    if (activeScreen === "welcome" && !shouldRun) resizeOrbit();
  }
  function updateMotion() {
    const reduced = paused || motionQuery.matches;
    if (reduced && viewAnimation) {
      navigationToken++;
      viewAnimation.cancel();
      viewAnimation = null;
      renderRoute(true);
    }
    root.classList.toggle("motion-paused",reduced);
    $("#motionBtn").setAttribute("aria-pressed",String(reduced));
    $("#motionBtn").setAttribute("aria-label",reduced ? "开启视觉动效" : "暂停视觉动效");
    $("#motionBtn").title = reduced ? "开启视觉动效" : "暂停视觉动效";
    syncOrbitLoop();
  }
  $("#motionBtn").addEventListener("click", () => {
    if (motionQuery.matches) { toast("已遵循系统的减少动态效果设置，可在系统设置中调整。"); return; }
    paused = !paused;
    savePreference("space-motion",paused ? "paused" : "running");
    updateMotion();
  });
  motionQuery.addEventListener("change",updateMotion);
  document.addEventListener("visibilitychange", () => { syncOrbitLoop(); if (!document.hidden) updateClock(); });
  if (context) {
    $(".orbital-scene").classList.add("canvas-ready");
    if ("ResizeObserver" in window) new ResizeObserver(resizeOrbit).observe(canvas);
    else window.addEventListener("resize",resizeOrbit,{ passive: true });
    $(".orbital-scene").addEventListener("pointermove", (event) => {
      if (motionQuery.matches || paused || event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      pointerX = (event.clientX-bounds.left)/bounds.width*2-1;
      pointerY = (event.clientY-bounds.top)/bounds.height*2-1;
    });
    $(".orbital-scene").addEventListener("pointerleave", () => { pointerX = 0; pointerY = 0; });
  }
  // Enhance only after initialization; all text remains readable without JS.
  renderRoute();
  root.classList.add("is-enhanced");
  applyTheme(root.dataset.theme);
  updateMotion();
})();
