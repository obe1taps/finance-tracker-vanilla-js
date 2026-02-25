export const STORAGE_KEY = "finance_tracker_transactions_v1";

const CURRENCY_KEY = "finance_tracker_currency"; // "RUB" | "USD" | "BYN"
const THEME_KEY = "finance_tracker_theme"; // "light" | "dark" | "auto"
const FILTERS_OPEN_KEY = "finance_filters_open_v1"; // "1" | "0"

// Transactions 
export function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTransactions(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

// Currency
export function loadCurrency() {
  try {
    const v = localStorage.getItem(CURRENCY_KEY);
    return v === "USD" || v === "BYN" || v === "RUB" ? v : "RUB";
  } catch {
    return "RUB";
  }
}

export function saveCurrency(code) {
  try {
    localStorage.setItem(CURRENCY_KEY, code);
  } catch {}
}

// Theme
export function loadThemeMode() {
  try {
    return localStorage.getItem(THEME_KEY) || "auto";
  } catch {
    return "auto";
  }
}

export function saveThemeMode(mode) {
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {}
}

// Filters accordion open/close
export function loadFiltersOpen() {
  try {
    return localStorage.getItem(FILTERS_OPEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveFiltersOpen(isOpen) {
  try {
    localStorage.setItem(FILTERS_OPEN_KEY, isOpen ? "1" : "0");
  } catch {}
}