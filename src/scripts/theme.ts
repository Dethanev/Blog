type Theme = "light" | "dark";

const KEY = "theme";

function preferred(): Theme {
  const stored = localStorage.getItem(KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

export function initTheme() {
  apply(preferred());
}

export function toggleTheme(originX?: number, originY?: number): Theme {
  const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";

  const stamp = document.createElement("div");
  stamp.className = "theme-stamp";
  if (originX !== undefined) stamp.style.setProperty("--x", `${originX}px`);
  if (originY !== undefined) stamp.style.setProperty("--y", `${originY}px`);
  stamp.style.background = next === "dark" ? "#0e0e14" : "#fcec52";
  document.body.appendChild(stamp);

  requestAnimationFrame(() => {
    stamp.classList.add("active");
  });

  window.setTimeout(() => {
    apply(next);
    localStorage.setItem(KEY, next);
  }, 280);

  window.setTimeout(() => {
    stamp.remove();
  }, 700);

  return next;
}

if (typeof window !== "undefined") {
  initTheme();
}
