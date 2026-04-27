import {
  DEFAULT_CURRENCY,
  TRANSACTION_TYPES,
} from "../../config/appConfig.js";
import { selectCategoryTotals } from "../../domain/selectors.js";
import { escapeHtml, formatMoney } from "../../utils/utils.js";

function renderStatsList({
  listEl,
  emptyEl,
  items,
  total,
  colorMap,
  currency,
  metaLabel,
  valueClass,
}) {
  listEl.innerHTML = "";
  emptyEl.style.display = items.length ? "none" : "block";

  for (const item of items) {
    const pct = total ? Math.round((item.total / total) * 100) : 0;
    const dot = colorMap?.get(item.category) || "#94a3b8";

    const li = document.createElement("li");
    li.className = "stats__item";
    li.innerHTML = `
      <div class="stats__left">
        <div class="stats__catRow">
          <span class="stats__dot" style="background:${dot}"></span>
          <div class="stats__cat">${escapeHtml(item.category)}</div>
        </div>
        <div class="stats__meta">${pct}% ${metaLabel}</div>
      </div>
      <div class="stats__value ${valueClass}">
        ${formatMoney(item.total, currency)}
      </div>
    `;
    listEl.appendChild(li);
  }
}

export function renderStats(
  {
    statsExpenseEl,
    statsIncomeEl,
    statsExpenseEmptyEl,
    statsIncomeEmptyEl,
  },
  transactions,
  colorMaps = {},
  currency = DEFAULT_CURRENCY,
) {
  const expenseItems = selectCategoryTotals(
    transactions,
    TRANSACTION_TYPES.EXPENSE,
  );
  const incomeItems = selectCategoryTotals(
    transactions,
    TRANSACTION_TYPES.INCOME,
  );

  const expenseTotal = expenseItems.reduce((sum, item) => sum + item.total, 0);
  const incomeTotal = incomeItems.reduce((sum, item) => sum + item.total, 0);

  renderStatsList({
    listEl: statsExpenseEl,
    emptyEl: statsExpenseEmptyEl,
    items: expenseItems,
    total: expenseTotal,
    colorMap: colorMaps.expenseColorMap,
    currency,
    metaLabel: "от расходов",
    valueClass: "expense",
  });

  renderStatsList({
    listEl: statsIncomeEl,
    emptyEl: statsIncomeEmptyEl,
    items: incomeItems,
    total: incomeTotal,
    colorMap: colorMaps.incomeColorMap,
    currency,
    metaLabel: "от доходов",
    valueClass: "income",
  });
}
