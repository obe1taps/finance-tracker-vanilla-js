export function getCurrentThemeMode() {
  const html = document.documentElement;
  const manual = html.getAttribute("data-theme");
  if (manual === "light" || manual === "dark") return manual;

  // auto: берём из OS
  return window.matchMedia?.("(prefers-color-scheme: light)")?.matches
    ? "light"
    : "dark";
}

export function applyTheme(mode, { themeToggleBtn } = {}) {
  const html = document.documentElement;

  if (mode === "light" || mode === "dark") {
    html.setAttribute("data-theme", mode);
  } else {
    html.removeAttribute("data-theme"); // auto by prefers-color-scheme
  }

  // иконка + aria-label
  if (themeToggleBtn) {
    const current = getCurrentThemeMode();
    themeToggleBtn.textContent = current === "light" ? "☀️" : "🌙";
    themeToggleBtn.setAttribute(
      "aria-label",
      current === "light"
        ? "Переключить на тёмную тему"
        : "Переключить на светлую тему",
    );
  }
}

export function toggleTheme({ saveThemeMode, themeToggleBtn } = {}) {
  const next = getCurrentThemeMode() === "light" ? "dark" : "light";

  if (typeof saveThemeMode === "function") saveThemeMode(next);
  applyTheme(next, { themeToggleBtn });

  return next;
}

export function bindAutoThemeListener({ loadThemeMode, themeToggleBtn } = {}) {
  const mq = window.matchMedia?.("(prefers-color-scheme: light)");
  mq?.addEventListener?.("change", () => {
    if (typeof loadThemeMode === "function" && loadThemeMode() === "auto") {
      applyTheme("auto", { themeToggleBtn });
    }
  });
}