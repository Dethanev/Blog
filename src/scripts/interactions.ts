import { initThemeToggle } from "./theme";
import { initViewCounters } from "./views";

const CONFETTI_COLORS = ["#ff5c8a", "#fcec52", "#b8e14a", "#7b61ff", "#2de2e6"];

type MotionLibs = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

type LenisHandle = {
  scrollTo: (target: number) => void;
};

let motionLibs: Promise<MotionLibs> | null = null;

function loadMotionLibs() {
  motionLibs ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return motionLibs;
}

function getActiveLenis() {
  return (window as Window & { __siteLenis?: LenisHandle | null }).__siteLenis ?? null;
}

async function spawnConfetti(x: number, y: number, count = 8) {
  const { gsap } = await loadMotionLibs();
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

let cleanupScrollProgress: (() => void) | null = null;

function initScrollProgress() {
  const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
  if (!bar || bar.dataset.scrollProgressBound === "1") return;
  bar.dataset.scrollProgressBound = "1";
  cleanupScrollProgress?.();

  const updateState = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener("scroll", updateState, { passive: true });
  window.addEventListener("resize", updateState, { passive: true });
  cleanupScrollProgress = () => {
    window.removeEventListener("scroll", updateState);
    window.removeEventListener("resize", updateState);
  };
  updateState();
}

function initStickers() {
  document.querySelectorAll<HTMLElement>("[data-sticker]").forEach((el) => {
    if (el.dataset.stickerBound === "1") return;
    el.dataset.stickerBound = "1";

    el.addEventListener("click", () => {
      void (async () => {
        const { gsap } = await loadMotionLibs();
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
        await spawnConfetti(cx, cy, 8);
      })();
    });
  });
}

function initClap() {
  const storageKey = "dethanev:claps:v1";
  const readClaps = (): Record<string, number> => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  document.querySelectorAll<HTMLElement>("[data-clap]").forEach((btn) => {
    if (btn.dataset.clapBound === "1") return;
    btn.dataset.clapBound = "1";

    const counter = btn.querySelector<HTMLElement>("[data-clap-count]");
    const postId = btn.dataset.clapPostId;
    if (!postId) return;
    const claps = readClaps();
    let count = typeof claps[postId] === "number" ? claps[postId] : 0;
    if (counter) counter.textContent = String(count);

    btn.addEventListener("click", () => {
      void (async () => {
        const { gsap } = await loadMotionLibs();
        count += 1;
        claps[postId] = count;
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(claps));
        } catch {
          // Keep the in-memory count when storage is unavailable.
        }
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
        await spawnConfetti(cx, cy, 5);

      })();
    });
  });
}

function initLogoEgg() {
  const logo = document.querySelector<HTMLElement>("[data-logo]");
  if (!logo) return;
  if (logo.dataset.logoEggBound === "1") return;
  logo.dataset.logoEggBound = "1";
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
      void (async () => {
        const { gsap } = await loadMotionLibs();
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
          background: var(--accent-pink, #ff5c8a);
          color: var(--text-on-pink, #180b10);
          border: 4px solid var(--ink, #000);
          padding: 14px 28px;
          box-shadow: 8px 8px 0 0 var(--shadow-color, #0a0a0f);
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
      })();
    }
  });
}

function initTagFilter() {
  const filters = document.querySelectorAll<HTMLElement>("[data-category-filter]");
  if (filters.length === 0) return;
  const cards = document.querySelectorAll<HTMLElement>("[data-post-tags]");
  const count = document.querySelector<HTMLElement>("[data-filter-count]");
  const allowed = new Set(Array.from(filters, (filter) => filter.dataset.categoryFilter ?? "all"));

  const applyFilter = (target: string) => {
    filters.forEach((filter) => {
      const active = filter.dataset.categoryFilter === target;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });

    let visibleCount = 0;
    cards.forEach((card) => {
      const visible = target === "all" || card.dataset.postCategory === target;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (count) count.textContent = String(visibleCount);
  };

  const targetFromURL = () => {
    const url = new URL(window.location.href);
    const target = url.searchParams.get("category") ?? "all";
    if (allowed.has(target)) return target;
    url.searchParams.delete("category");
    window.history.replaceState({}, "", url);
    return "all";
  };

  filters.forEach((filter) => {
    if (filter.dataset.filterBound === "1") return;
    filter.dataset.filterBound = "1";
    filter.addEventListener("click", () => {
      const target = filter.dataset.categoryFilter ?? "all";
      const url = new URL(window.location.href);
      if (target === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", target);
      window.history.pushState({}, "", url);
      applyFilter(target);
    });
  });

  window.addEventListener("popstate", () => applyFilter(targetFromURL()));
  applyFilter(targetFromURL());
}

let cleanupBackToTop: (() => void) | null = null;

function initBackToTop() {
  const button = document.querySelector<HTMLButtonElement>("[data-back-to-top]");
  if (!button || button.dataset.backToTopBound === "1") return;
  button.dataset.backToTopBound = "1";
  cleanupBackToTop?.();

  const updateState = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
    const isMobile = window.matchMedia("(max-width: 720px)").matches;

    button.style.setProperty("--scroll-progress", String(progress));
    button.classList.toggle("is-visible", isMobile ? progress >= 0.2 : window.scrollY > 160);
  };
  window.addEventListener("scroll", updateState, { passive: true });
  window.addEventListener("resize", updateState, { passive: true });
  cleanupBackToTop = () => {
    window.removeEventListener("scroll", updateState);
    window.removeEventListener("resize", updateState);
  };
  updateState();

  button.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const activeLenis = getActiveLenis();

    if (!reduceMotion) {
      button.classList.remove("is-jumping");
      requestAnimationFrame(() => button.classList.add("is-jumping"));
      button.addEventListener("animationend", () => button.classList.remove("is-jumping"), { once: true });
    }

    if (activeLenis && !reduceMotion) {
      activeLenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
  });
}

export function initInteractions() {
  initViewCounters();
  initScrollProgress();
  initStickers();
  initThemeToggle();
  initClap();
  initLogoEgg();
  initBackToTop();
  initTagFilter();
}
