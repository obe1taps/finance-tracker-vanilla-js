export const TRANSACTION_TYPES = Object.freeze({
  INCOME: "income",
  EXPENSE: "expense",
});

export const TYPE_LABELS = Object.freeze({
  [TRANSACTION_TYPES.INCOME]: "Доход",
  [TRANSACTION_TYPES.EXPENSE]: "Расход",
});

export const SEARCH_TYPE_LABELS = Object.freeze({
  [TRANSACTION_TYPES.INCOME]: "доход",
  [TRANSACTION_TYPES.EXPENSE]: "расход",
});

export const CURRENCIES = Object.freeze(["RUB", "USD", "BYN"]);
export const DEFAULT_CURRENCY = "RUB";

export const DEFAULT_FILTERS = Object.freeze({
  type: "all",
  category: "all",
  query: "",
  sort: "desc",
  period: "all",
  from: "",
  to: "",
});

export const DEFAULT_PAGING = Object.freeze({
  limit: 10,
  step: 10,
});

export const UNDO_MS = 5000;

export const CATEGORY_FALLBACK = "Без категории";
export const OTHER_CATEGORY = "Другое";

export const BUDGET_PROGRESS = Object.freeze({
  warningPct: 80,
  maxPct: 100,
});

export const STORAGE_KEYS = Object.freeze({
  transactions: "finance_tracker_transactions_v1",
  currency: "finance_tracker_currency",
  theme: "finance_tracker_theme",
  filtersOpen: "finance_filters_open_v1",
  monthlyBudget: "finance_monthly_budget_v1",
});
