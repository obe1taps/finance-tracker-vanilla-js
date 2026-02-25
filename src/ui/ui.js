import { selectTotals, selectCategoryTotals } from "../domain/selectors.js";
import { formatMoney, escapeHtml } from "../utils/utils.js";

export function hidePager({ pagerEl, pagerInfoEl, loadMoreBtn }) {
  if (!pagerEl || !pagerInfoEl || !loadMoreBtn) return;
  pagerEl.style.display = "none";
  pagerInfoEl.textContent = "";
  loadMoreBtn.style.display = "none";
}

export function renderTotals({ incomeEl, expenseEl, balanceEl }, transactions, currency) {
  const { income, expense, balance } = selectTotals(transactions);

  incomeEl.textContent = formatMoney(income, currency);
  expenseEl.textContent = formatMoney(expense, currency);

  balanceEl.textContent = formatMoney(balance, currency);
  balanceEl.classList.toggle("income", balance >= 0);
  balanceEl.classList.toggle("expense", balance < 0);
}

export function renderStats(
  { statsExpenseEl, statsIncomeEl, statsExpenseEmptyEl, statsIncomeEmptyEl },
  transactions,
  colorMaps = {},
  currency = "RUB",
) {
  const expenseItems = selectCategoryTotals(transactions, "expense");
  const incomeItems = selectCategoryTotals(transactions, "income");

  const expenseTotal = expenseItems.reduce((s, x) => s + x.total, 0);
  const incomeTotal = incomeItems.reduce((s, x) => s + x.total, 0);

  // расходы
  statsExpenseEl.innerHTML = "";
  statsExpenseEmptyEl.style.display = expenseItems.length ? "none" : "block";

  for (const item of expenseItems) {
    const pct = expenseTotal ? Math.round((item.total / expenseTotal) * 100) : 0;
    const dot = colorMaps.expenseColorMap?.get(item.category) || "#94a3b8";

    const li = document.createElement("li");
    li.className = "stats__item";
    li.innerHTML = `
      <div class="stats__left">
        <div class="stats__catRow">
          <span class="stats__dot" style="background:${dot}"></span>
          <div class="stats__cat">${escapeHtml(item.category)}</div>
        </div>
        <div class="stats__meta">${pct}% от расходов</div>
      </div>
      <div class="stats__value expense">${formatMoney(item.total, currency)}</div>
    `;
    statsExpenseEl.appendChild(li);
  }

  // доходы
  statsIncomeEl.innerHTML = "";
  statsIncomeEmptyEl.style.display = incomeItems.length ? "none" : "block";

  for (const item of incomeItems) {
    const pct = incomeTotal ? Math.round((item.total / incomeTotal) * 100) : 0;
    const dot = colorMaps.incomeColorMap?.get(item.category) || "#94a3b8";

    const li = document.createElement("li");
    li.className = "stats__item";
    li.innerHTML = `
      <div class="stats__left">
        <div class="stats__catRow">
          <span class="stats__dot" style="background:${dot}"></span>
          <div class="stats__cat">${escapeHtml(item.category)}</div>
        </div>
        <div class="stats__meta">${pct}% от доходов</div>
      </div>
      <div class="stats__value income">${formatMoney(item.total, currency)}</div>
    `;
    statsIncomeEl.appendChild(li);
  }
}

export function renderList(
  { listEl, emptyEl, pagerEl, pagerInfoEl, loadMoreBtn },
  { transactionsAll, visible, paging, editingId },
  currency = "RUB",
) {
  listEl.innerHTML = "";
  hidePager({ pagerEl, pagerInfoEl, loadMoreBtn });

  if (transactionsAll.length === 0) {
    emptyEl.style.display = "block";
    emptyEl.textContent = "Операций пока нет. Добавь первую 👇";
    return;
  }

  if (visible.length === 0) {
    emptyEl.style.display = "block";
    emptyEl.textContent = "Ничего не найдено по фильтрам 🙃";
    return;
  }

  emptyEl.style.display = "none";

  const total = visible.length;
  const shown = Math.min(paging.limit, total);
  const slice = visible.slice(0, shown);

  for (const t of slice) {
    const li = document.createElement("li");
    li.className = "item";
    li.dataset.id = t.id;

    if (editingId === t.id) li.classList.add("item--editing");

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = t.category;

    const info = document.createElement("div");
    info.innerHTML = `
      <div><strong>${t.date}</strong> • <span class="${t.type}">${t.type === "income" ? "Доход" : "Расход"}</span></div>
      <div class="note">${t.note ? escapeHtml(t.note) : ""}</div>
    `;

    const amount = document.createElement("div");
    amount.className = `amount ${t.type}`;
    amount.textContent =
      (t.type === "expense" ? "− " : "+ ") + formatMoney(t.amount, currency);

    const btn = document.createElement("button");
    btn.className = "remove";
    btn.type = "button";
    btn.title = "Удалить";
    btn.textContent = "×";
    btn.dataset.action = "remove";

    li.append(badge, info, amount, btn);
    listEl.append(li);
  }

  pagerEl.style.display = total > 0 ? "flex" : "none";
  pagerInfoEl.textContent = `Показано ${shown} из ${total}`;
  loadMoreBtn.style.display = shown < total ? "inline-flex" : "none";
}