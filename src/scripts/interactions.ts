import { gsap } from "gsap";
import { toggleTheme } from "./theme";

const CONFETTI_COLORS = ["#ff5c8a", "#fcec52", "#b8e14a", "#7b61ff", "#2de2e6"];

function spawnConfetti(x: number, y: number, count = 8) {
  const layer = ensureLayer();
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    const size = 8 + Math.random() * 8;
    piece.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};
      border: 2px solid var(--ink);
      pointer-events: none;
      z-index: 9998;
    `;
    layer.appendChild(piece);

    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const distance = 60 + Math.random() * 80;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;

    gsap.to(piece, {
      x: dx,
      y: dy,
      rotation: Math.random() * 720 - 360,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      onComplete: () => piece.remove(),
    });
  }
}

let layerEl: HTMLDivElement | null = null;
function ensureLayer() {
  if (layerEl && document.body.contains(layerEl)) return layerEl;
  layerEl = document.createElement("div");
  layerEl.setAttribute("aria-hidden", "true");
  layerEl.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9998;";
  document.body.appendChild(layerEl);
  return layerEl;
}

function initStickers() {
  document.querySelectorAll<HTMLElement>("[data-sticker]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      gsap.fromTo(
        el,
        { rotate: 0 },
        {
          keyframes: [
            { rotate: -18, duration: 0.08 },
            { rotate: 14, duration: 0.08 },
            { rotate: -8, duration: 0.08 },
            { rotate: 0, duration: 0.12 },
          ],
        }
      );
      spawnConfetti(cx, cy, 8);
    });
  });
}

function initThemeToggle() {
  document.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((el) => {
    if (el.dataset.themeBound === "1") return;
    el.dataset.themeBound = "1";
    el.addEventListener("click", (e) => {
      const rect = el.getBoundingClientRect();
      toggleTheme(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });
}

function initClap() {
  document.querySelectorAll<HTMLElement>("[data-clap]").forEach((btn) => {
    const counter = btn.querySelector<HTMLElement>("[data-clap-count]");
    let count = Number(btn.dataset.clapStart ?? counter?.textContent ?? "0");
    let combo = 0;
    let comboTimer: number | null = null;

    btn.addEventListener("click", (e) => {
      count++;
      combo++;
      if (counter) counter.textContent = String(count);

      gsap.fromTo(
        btn,
        { scale: 1, x: 0, y: 0 },
        {
          keyframes: [
            { scale: 0.92, x: 2, y: 2, duration: 0.08 },
            { scale: 1, x: 0, y: 0, duration: 0.18, ease: "back.out(3)" },
          ],
        }
      );

      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + 6;
      spawnConfetti(cx, cy, 5);

      if (combo > 3) {
        const comboEl = document.createElement("div");
        comboEl.textContent = `+${combo} COMBO!`;
        comboEl.style.cssText = `
          position: fixed; left: ${cx}px; top: ${cy}px;
          transform: translate(-50%, 0);
          font-family: var(--font-display, system-ui); font-weight: 900;
          font-size: 1.1rem; color: var(--ink, #000);
          background: var(--accent-2, yellow);
          border: 3px solid var(--ink, #000);
          padding: 4px 10px;
          pointer-events: none; z-index: 9998;
        `;
        ensureLayer().appendChild(comboEl);
        gsap.to(comboEl, {
          y: -50,
          opacity: 0,
          rotate: Math.random() * 14 - 7,
          duration: 0.9,
          ease: "power2.out",
          onComplete: () => comboEl.remove(),
        });
      }

      if (comboTimer) window.clearTimeout(comboTimer);
      comboTimer = window.setTimeout(() => {
        combo = 0;
      }, 1200);
    });
  });
}

function initLogoEgg() {
  const logo = document.querySelector<HTMLElement>("[data-logo]");
  if (!logo) return;
  let taps = 0;
  let tapTimer: number | null = null;
  logo.addEventListener("click", (e) => {
    taps++;
    if (tapTimer) window.clearTimeout(tapTimer);
    tapTimer = window.setTimeout(() => {
      taps = 0;
    }, 1500);

    if (taps >= 5) {
      e.preventDefault();
      taps = 0;
      const stickers = document.querySelectorAll<HTMLElement>("[data-sticker]");
      stickers.forEach((el) => {
        const dx = (Math.random() - 0.5) * 80;
        const dy = (Math.random() - 0.5) * 60;
        const rot = (Math.random() - 0.5) * 90;
        gsap.to(el, {
          x: dx,
          y: dy,
          rotate: rot,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
          yoyo: true,
          repeat: 1,
        });
      });

      const banner = document.createElement("div");
      banner.textContent = "✦  YOU FOUND IT  ✦";
      banner.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-4deg);
        font-family: var(--font-display, system-ui); font-weight: 900; font-size: 2rem;
        background: var(--accent-1, hotpink);
        color: var(--ink, #000);
        border: 4px solid var(--ink, #000);
        padding: 14px 28px;
        box-shadow: 8px 8px 0 0 var(--ink, #000);
        pointer-events: none; z-index: 9999;
      `;
      document.body.appendChild(banner);
      gsap.fromTo(
        banner,
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)" }
      );
      gsap.to(banner, {
        opacity: 0,
        duration: 0.4,
        delay: 1.6,
        onComplete: () => banner.remove(),
      });
    }
  });
}

function initTagFilter() {
  const tags = document.querySelectorAll<HTMLElement>("[data-tag-filter]");
  if (tags.length === 0) return;
  const cards = document.querySelectorAll<HTMLElement>("[data-post-tags]");

  tags.forEach((t) => {
    t.addEventListener("click", () => {
      const target = t.dataset.tagFilter ?? "all";
      tags.forEach((x) => x.classList.toggle("is-active", x === t));

      gsap.fromTo(t, { scale: 1 }, { scale: 1.1, duration: 0.12, yoyo: true, repeat: 1 });

      cards.forEach((card) => {
        const tagsAttr = card.dataset.postTags ?? "";
        const match = target === "all" || tagsAttr.split(",").includes(target);
        gsap.to(card, {
          opacity: match ? 1 : 0.15,
          scale: match ? 1 : 0.95,
          duration: 0.25,
          ease: "power2.out",
        });
        card.style.pointerEvents = match ? "auto" : "none";
      });
    });
  });
}

export function initInteractions() {
  initStickers();
  initThemeToggle();
  initClap();
  initLogoEgg();
  initTagFilter();
}
