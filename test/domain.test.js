import test from "node:test";
import assert from "node:assert/strict";

import { getBudgetSummary } from "../src/domain/budget.js";
import { applyFilters, getDefaultFilters } from "../src/domain/filters.js";
import {
  selectCategoryTotals,
  selectMonthOverview,
  selectTotals,
  selectTopWithOther,
} from "../src/domain/selectors.js";
import { parseMoneyInput } from "../src/utils/utils.js";

const transactions = [
  {
    id: "1",
    type: "expense",
    amount: 1200,
    category: "Еда",
    date: "2026-04-01",
    note: "магазин",
  },
  {
    id: "2",
    type: "expense",
    amount: 4555,
    category: "Жильё",
    date: "2026-04-27",
    note: "квартира",
  },
  {
    id: "3",
    type: "income",
    amount: 100000,
    category: "Зарплата",
    date: "2026-04-15",
    note: "",
  },
  {
    id: "4",
    type: "income",
    amount: 500,
    category: "Возврат",
    date: "2026-03-15",
    note: "кэшбек",
  },
];

test("parseMoneyInput normalizes common money formats", () => {
  assert.equal(parseMoneyInput("1 234,56 ₽"), 1234.56);
  assert.equal(parseMoneyInput("2\u00A0500.10"), 2500.1);
  assert.ok(Number.isNaN(parseMoneyInput("")));
});

test("selectTotals calculates income, expense and balance", () => {
  assert.deepEqual(selectTotals(transactions), {
    income: 100500,
    expense: 5755,
    balance: 94745,
  });
});

test("selectCategoryTotals aggregates and sorts categories", () => {
  assert.deepEqual(selectCategoryTotals(transactions, "expense"), [
    { category: "Жильё", total: 4555 },
    { category: "Еда", total: 1200 },
  ]);
});

test("selectMonthOverview includes only selected month", () => {
  const overview = selectMonthOverview(transactions, "2026-04-27");

  assert.equal(overview.income, 100000);
  assert.equal(overview.expense, 5755);
  assert.equal(overview.balance, 94245);
  assert.equal(overview.operations, 3);
  assert.equal(overview.averageDailyExpense, 5755 / 27);
  assert.equal(overview.largestExpense.id, "2");
});

test("selectTopWithOther keeps top items and groups the rest", () => {
  const items = [
    { category: "A", total: 10 },
    { category: "B", total: 8 },
    { category: "C", total: 4 },
    { category: "D", total: 2 },
  ];

  assert.deepEqual(selectTopWithOther(items, 2, "Остальное"), [
    { category: "A", total: 10 },
    { category: "B", total: 8 },
    { category: "Остальное", total: 6 },
  ]);
});

test("applyFilters searches across note, category, date, amount and type", () => {
  const base = getDefaultFilters();

  assert.deepEqual(
    applyFilters(transactions, { ...base, query: "жильё" }).map((t) => t.id),
    ["2"],
  );
  assert.deepEqual(
    applyFilters(transactions, { ...base, query: "2026-04-15" }).map(
      (t) => t.id,
    ),
    ["3"],
  );
  assert.deepEqual(
    applyFilters(transactions, { ...base, query: "4555" }).map((t) => t.id),
    ["2"],
  );
  assert.deepEqual(
    applyFilters(transactions, { ...base, query: "доход" }).map((t) => t.id),
    ["3", "4"],
  );
});

test("applyFilters supports custom date periods", () => {
  const filters = {
    ...getDefaultFilters(),
    period: "custom",
    from: "2026-04-01",
    to: "2026-04-30",
  };

  assert.deepEqual(
    applyFilters(transactions, filters).map((t) => t.id),
    ["2", "3", "1"],
  );
});

test("getBudgetSummary reports empty, good, warning and danger states", () => {
  assert.equal(getBudgetSummary(0, 100).status, "empty");
  assert.equal(getBudgetSummary(1000, 300).status, "good");
  assert.equal(getBudgetSummary(1000, 850).status, "warning");
  assert.equal(getBudgetSummary(1000, 1100).status, "danger");
});
