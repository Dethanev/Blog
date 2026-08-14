type Theme = "light" | "dark";

const KEY = "theme";
const THEME_COLORS: Record<Theme, string> = {
  light: "#fff7e6",
  dark: "#0e0e14",
};

function preferred(): Theme {
  try {
    const stored = localStorage.getItem(KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Browsers may block storage; light remains the deterministic fallback.
  }
  return "light";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);

  document.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((toggle) => {
    const isDark = theme === "dark";
    const label = isDark ? "切換為日間模式" : "切換為夜間模式";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
  });
}

export function initTheme() {
  apply(preferred());
}

export function toggleTheme(originX?: number, originY?: number): Theme {
  const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";

  try {
    localStorage.setItem(KEY, next);
  } catch {
    // The theme still changes for the current page when storage is unavailable.
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply(next);
    return next;
  }

  const stamp = document.createElement("div");
  stamp.className = "theme-stamp";
  if (originX !== undefined) stamp.style.setProperty("--x", `${originX}px`);
  if (originY !== undefined) stamp.style.setProperty("--y", `${originY}px`);
  stamp.style.background = THEME_COLORS[next];
  document.body.appendChild(stamp);

  requestAnimationFrame(() => {
    stamp.classList.add("active");
  });

  window.setTimeout(() => {
    apply(next);
  }, 280);

  window.setTimeout(() => {
    stamp.remove();
  }, 700);

  return next;
}

export function initThemeToggle() {
  document.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((toggle) => {
    if (toggle.dataset.themeBound === "1") return;
    toggle.dataset.themeBound = "1";
    toggle.addEventListener("click", () => {
      const rect = toggle.getBoundingClientRect();
      toggleTheme(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });
}

if (typeof window !== "undefined") {
  initTheme();
}
