/* =========================================================
   我爱学习 · 个人主页 — 交互脚本
   无依赖，全部原生 JS
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 工具 ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- 1. 主题切换（深 / 浅） ---------- */
  const THEME_KEY = "site-theme";
  const themeBtn = $("#themeBtn");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.querySelector(".theme-toggle__text").textContent =
        theme === "light" ? "深色" : "浅色";
      themeBtn.setAttribute(
        "aria-label",
        theme === "light" ? "切换到深色主题" : "切换到浅色主题"
      );
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f2f6fc" : "#060a12");
  }

  // 首次进入：优先读取本地保存，否则跟随系统
  const savedTheme = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  })();

  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
  } else {
    applyTheme(
      window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"
    );
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next =
        root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* 隐私模式下保存失败，忽略即可 */
      }
    });
  }

  /* ---------- 2. 移动端导航抽屉 ---------- */
  const menuBtn = $("#menuBtn");
  const sidebar = $("#sidebar");
  const overlay = $("#sidebarOverlay");

  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
    }
    if (overlay) overlay.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      setNav(!document.body.classList.contains("nav-open"));
    });
  }
  if (overlay) {
    overlay.addEventListener("click", () => setNav(false));
  }
  // 点导航链接后自动收起
  if (sidebar) {
    $$(".nav__link", sidebar).forEach((link) =>
      link.addEventListener("click", () => setNav(false))
    );
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!lightboxOpen()) setNav(false);
    }
  });

  /* ---------- 2.5 头像放大查看 ---------- */
  const avatarBtn = $("#avatarBtn");
  const lightbox = $("#lightbox");
  const lightboxClose = $("#lightboxClose");
  let lastFocused = null;

  function lightboxOpen() {
    return !!lightbox && !lightbox.hidden;
  }

  function openLightbox() {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (avatarBtn) avatarBtn.addEventListener("click", openLightbox);
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxOpen()) closeLightbox();
  });

  /* ---------- 3. 滚动高亮当前章节 ---------- */
  const navLinks = $$(".nav__link");
  const sectionMap = new Map();

  navLinks.forEach((link) => {
    const id = link.getAttribute("href");
    if (!id || !id.startsWith("#")) return;
    const section = document.querySelector(id);
    if (section) sectionMap.set(section, link);
  });

  function setActive(link) {
    navLinks.forEach((l) => l.classList.remove("is-active"));
    if (link) link.classList.add("is-active");
  }

  if ("IntersectionObserver" in window && sectionMap.size) {
    const visible = new Map();

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target, entry.intersectionRatio);
          } else {
            visible.delete(entry.target);
          }
        });

        // 取当前可见比例最大的章节
        let best = null;
        let bestRatio = 0;
        visible.forEach((ratio, el) => {
          if (ratio >= bestRatio) {
            bestRatio = ratio;
            best = el;
          }
        });
        if (best) setActive(sectionMap.get(best));
      },
      {
        // 触发区域：屏幕中上部一条带
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.6, 1],
      }
    );

    sectionMap.forEach((_, section) => spy.observe(section));
  }

  /* ---------- 4. 入场动画 ---------- */
  const revealEls = $$("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // 同组元素依次错开出现
          const siblings = el.parentElement
            ? $$("[data-reveal]", el.parentElement)
            : [];
          const index = Math.max(0, siblings.indexOf(el));
          el.style.transitionDelay = Math.min(index * 70, 350) + "ms";
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- 5. 回到顶部 ---------- */
  const toTop = $("#toTop");

  function onScroll() {
    if (!toTop) return;
    toTop.classList.toggle("is-visible", window.scrollY > 520);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------- 6. 页脚年份自动更新 ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 7. 背景粒子（科技感点缀） ---------- */
  const canvas = $("#bgParticles");

  if (canvas && !reduceMotion && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const CONFIG = {
      density: 16000, // 每 16000px² 一个粒子
      maxCount: 72,
      speed: 0.22,
      linkDist: 130,
      radius: 1.5,
    };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        CONFIG.maxCount,
        Math.max(18, Math.floor((width * height) / CONFIG.density))
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // 边界回弹
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, CONFIG.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(46, 230, 255, 0.55)";
        ctx.fill();

        // 连线
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist > CONFIG.linkDist) continue;

          const alpha = (1 - dist / CONFIG.linkDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "rgba(46, 230, 255, " + alpha.toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    // 页面不可见时暂停，避免空转
    function start() {
      if (rafId) return;
      rafId = requestAnimationFrame(tick);
    }
    function stop() {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = 0;
    }

    document.addEventListener("visibilitychange", () => {
      document.hidden ? stop() : start();
    });

    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    });

    resize();
    start();
  }
})();
