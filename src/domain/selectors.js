import {
  CATEGORY_FALLBACK,
  OTHER_CATEGORY,
  TRANSACTION_TYPES,
} from "../config/appConfig.js";

/** @typedef {import("./types.js").Transaction} Transaction */

function toNumber(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

/**
 * @param {Transaction[]} transactions
 */
export function selectTotals(transactions) {
  let income = 0;
  let expense = 0;

  for (const t of transactions) {
    const amount = toNumber(t.amount);
    if (t.type === TRANSACTION_TYPES.INCOME) income += amount;
    if (t.type === TRANSACTION_TYPES.EXPENSE) expense += amount;
  }

  return { income, expense, balance: income - expense };
}

/**
 * @param {Transaction[]} transactions
 * @param {Transaction["type"]} type
 */
export function selectCategoryTotals(transactions, type) {
  const map = new Map();

  for (const t of transactions) {
    if (t.type !== type) continue;

    const key = t.category || CATEGORY_FALLBACK;
    map.set(key, (map.get(key) || 0) + toNumber(t.amount));
  }

  const items = Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);

  return items;
}

/**
 * @param {Transaction[]} transactions
 * @param {string} dateISO
 */
export function selectMonthOverview(transactions, dateISO) {
  const monthKey = String(dateISO || "").slice(0, 7);
  const currentDay = Number(String(dateISO || "").slice(8, 10)) || 1;

  if (!monthKey) {
    return {
      income: 0,
      expense: 0,
      balance: 0,
      operations: 0,
      averageDailyExpense: 0,
      largestExpense: null,
    };
  }

  const monthItems = transactions.filter((t) =>
    String(t.date || "").startsWith(monthKey),
  );

  let income = 0;
  let expense = 0;
  let largestExpense = null;

  for (const t of monthItems) {
    const amount = toNumber(t.amount);

    if (t.type === TRANSACTION_TYPES.INCOME) {
      income += amount;
      continue;
    }

    if (t.type === TRANSACTION_TYPES.EXPENSE) {
      expense += amount;
      if (!largestExpense || amount > toNumber(largestExpense.amount)) {
        largestExpense = t;
      }
    }
  }

  return {
    income,
    expense,
    balance: income - expense,
    operations: monthItems.length,
    averageDailyExpense: expense / Math.max(currentDay, 1),
    largestExpense,
  };
}

export function selectTopWithOther(items, topN = 6, otherLabel = OTHER_CATEGORY) {
  if (items.length <= topN) return items;

  const top = items.slice(0, topN);
  const rest = items.slice(topN);
  const otherTotal = rest.reduce((sum, x) => sum + toNumber(x.total), 0);

  if (otherTotal > 0) top.push({ category: otherLabel, total: otherTotal });
  return top;
}
