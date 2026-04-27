import { DEFAULT_CURRENCY } from "../../config/appConfig.js";
import { getBudgetSummary } from "../../domain/budget.js";
import { selectMonthOverview } from "../../domain/selectors.js";
import { formatMoney, todayISO } from "../../utils/utils.js";

function renderSignedMoney(el, value, currency) {
  if (!el) return;

  el.textContent = formatMoney(value, currency);
  el.classList.toggle("income", value >= 0);
  el.classList.toggle("expense", value < 0);
}

function renderBudgetLeft(el, budgetSummary, currency) {
  if (!el) return;

  if (!budgetSummary.budget) {
    el.textContent = "Укажите лимит";
    el.classList.remove("income", "expense");
    return;
  }

  el.textContent = formatMoney(Math.abs(budgetSummary.left), currency);
  el.classList.toggle("income", budgetSummary.left >= 0);
  el.classList.toggle("expense", budgetSummary.left < 0);
}

function renderBudgetProgress(el, budgetSummary) {
  if (!el) return;

  el.style.width = `${budgetSummary.progress}%`;
  el.classList.toggle("is-warning", budgetSummary.status === "warning");
  el.classList.toggle("is-danger", budgetSummary.status === "danger");
}

function renderBudgetStatus(el, budgetSummary, currency) {
  if (!el) return;

  if (!budgetSummary.budget) {
    el.textContent = "Задайте бюджет, чтобы видеть остаток на месяц.";
    el.className = "budgetStatus";
    return;
  }

  if (budgetSummary.status === "danger") {
    el.textContent = `Лимит превышен на ${formatMoney(
      Math.abs(budgetSummary.left),
      currency,
    )}.`;
    el.className = "budgetStatus budgetStatus--danger";
    return;
  }

  if (budgetSummary.status === "warning") {
    el.textContent = `Осталось ${formatMoney(
      budgetSummary.left,
      currency,
    )} до лимита.`;
    el.className = "budgetStatus budgetStatus--warning";
    return;
  }

  el.textContent = `В запасе ${formatMoney(budgetSummary.left, currency)}.`;
  el.className = "budgetStatus budgetStatus--good";
}

export function renderMonthOverview(
  {
    monthlySpentEl,
    monthlyIncomeEl,
    monthlyBalanceEl,
    dailyAverageEl,
    largestExpenseEl,
    largestExpenseMetaEl,
    operationsCountEl,
    budgetLeftEl,
    budgetProgressEl,
    budgetStatusEl,
  },
  transactions,
  { currency = DEFAULT_CURRENCY, monthlyBudget = 0, date = todayISO() } = {},
) {
  const overview = selectMonthOverview(transactions, date);
  const budgetSummary = getBudgetSummary(monthlyBudget, overview.expense);

  if (monthlySpentEl) {
    monthlySpentEl.textContent = formatMoney(overview.expense, currency);
  }
  if (monthlyIncomeEl) {
    monthlyIncomeEl.textContent = formatMoney(overview.income, currency);
  }
  if (dailyAverageEl) {
    dailyAverageEl.textContent = formatMoney(
      overview.averageDailyExpense,
      currency,
    );
  }
  if (operationsCountEl) {
    operationsCountEl.textContent = String(overview.operations);
  }

  renderSignedMoney(monthlyBalanceEl, overview.balance, currency);
  renderBudgetLeft(budgetLeftEl, budgetSummary, currency);
  renderBudgetProgress(budgetProgressEl, budgetSummary);
  renderBudgetStatus(budgetStatusEl, budgetSummary, currency);

  if (largestExpenseEl) {
    largestExpenseEl.textContent = overview.largestExpense
      ? formatMoney(overview.largestExpense.amount, currency)
      : "Нет расходов";
  }

  if (largestExpenseMetaEl) {
    largestExpenseMetaEl.textContent = overview.largestExpense
      ? `${overview.largestExpense.category} • ${overview.largestExpense.date}`
      : "За текущий месяц";
  }
}
