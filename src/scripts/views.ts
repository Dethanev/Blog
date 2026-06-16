type ViewStats = {
  site: number;
  posts: Record<string, number>;
};

const STORAGE_KEY = "dethanev:view-stats:v1";

function readStats(): ViewStats {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { site: 0, posts: {} };

    const parsed = JSON.parse(raw) as Partial<ViewStats>;
    return {
      site: typeof parsed.site === "number" ? parsed.site : 0,
      posts: parsed.posts && typeof parsed.posts === "object" ? parsed.posts : {},
    };
  } catch {
    return { site: 0, posts: {} };
  }
}

function writeStats(stats: ViewStats) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Private browsing or strict storage settings can block writes.
  }
}

function formatViews(value: number): string {
  if (value >= 10000) {
    return `${Math.floor(value / 1000).toLocaleString("en-US")}k`;
  }

  return value.toLocaleString("en-US");
}

function getPostKey(counters: HTMLElement[]): string | null {
  const postCounter = counters.find((counter) => counter.dataset.viewScope === "post");
  return postCounter?.dataset.viewKey ?? null;
}

function updateCounters(counters: HTMLElement[], stats: ViewStats) {
  counters.forEach((counter) => {
    const countEl = counter.querySelector<HTMLElement>("[data-view-count]");
    if (!countEl) return;

    const scope = counter.dataset.viewScope;
    const key = counter.dataset.viewKey ?? "";
    const value = scope === "post" ? stats.posts[key] ?? 0 : stats.site;

    countEl.textContent = formatViews(value);
  });
}

export function initViewCounters() {
  const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-view-counter]"));
  if (counters.length === 0) return;

  const stats = readStats();
  const currentPath = `${window.location.pathname}${window.location.search}`;

  if (document.documentElement.dataset.viewCountedPath !== currentPath) {
    document.documentElement.dataset.viewCountedPath = currentPath;
    stats.site += 1;

    const postKey = getPostKey(counters);
    if (postKey) {
      stats.posts[postKey] = (stats.posts[postKey] ?? 0) + 1;
    }

    writeStats(stats);
  }

  updateCounters(counters, stats);
}
