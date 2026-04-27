import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  STORAGE_KEYS,
} from "../config/appConfig.js";

export const STORAGE_KEY = STORAGE_KEYS.transactions;

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
    const v = localStorage.getItem(STORAGE_KEYS.currency);
    return CURRENCIES.includes(v) ? v : DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
}

export function saveCurrency(code) {
  try {
    localStorage.setItem(STORAGE_KEYS.currency, code);
  } catch {}
}

// Monthly budget
export function loadMonthlyBudget() {
  try {
    const value = Number(localStorage.getItem(STORAGE_KEYS.monthlyBudget));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function saveMonthlyBudget(value) {
  try {
    const next = Number(value);
    if (!Number.isFinite(next) || next <= 0) {
      localStorage.removeItem(STORAGE_KEYS.monthlyBudget);
      return;
    }

    localStorage.setItem(STORAGE_KEYS.monthlyBudget, String(next));
  } catch {}
}

// Theme
export function loadThemeMode() {
  try {
    return localStorage.getItem(STORAGE_KEYS.theme) || "auto";
  } catch {
    return "auto";
  }
}

export function saveThemeMode(mode) {
  try {
    localStorage.setItem(STORAGE_KEYS.theme, mode);
  } catch {}
}

// Filters accordion open/close
export function loadFiltersOpen() {
  try {
    return localStorage.getItem(STORAGE_KEYS.filtersOpen) === "1";
  } catch {
    return false;
  }
}

export function saveFiltersOpen(isOpen) {
  try {
    localStorage.setItem(STORAGE_KEYS.filtersOpen, isOpen ? "1" : "0");
  } catch {}
}
