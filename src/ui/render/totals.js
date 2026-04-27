import { selectTotals } from "../../domain/selectors.js";
import { formatMoney } from "../../utils/utils.js";

export function renderTotals(
  { incomeEl, expenseEl, balanceEl },
  transactions,
  currency,
) {
  const { income, expense, balance } = selectTotals(transactions);

  incomeEl.textContent = formatMoney(income, currency);
  expenseEl.textContent = formatMoney(expense, currency);

  balanceEl.textContent = formatMoney(balance, currency);
  balanceEl.classList.toggle("income", balance >= 0);
  balanceEl.classList.toggle("expense", balance < 0);
}
