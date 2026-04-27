import {
  DEFAULT_CURRENCY,
  TRANSACTION_TYPES,
  TYPE_LABELS,
} from "../../config/appConfig.js";
import { escapeHtml, formatMoney } from "../../utils/utils.js";

export function hidePager({ pagerEl, pagerInfoEl, loadMoreBtn }) {
  if (!pagerEl || !pagerInfoEl || !loadMoreBtn) return;

  pagerEl.style.display = "none";
  pagerInfoEl.textContent = "";
  loadMoreBtn.style.display = "none";
}

function renderEmptyState({ emptyEl }, message) {
  emptyEl.style.display = "block";
  emptyEl.textContent = message;
}

function createTransactionItem(transaction, { currency, editingId }) {
  const li = document.createElement("li");
  li.className = "item";
  li.dataset.id = transaction.id;

  if (editingId === transaction.id) li.classList.add("item--editing");

  const badge = document.createElement("div");
  badge.className = "badge";
  badge.textContent = transaction.category;

  const info = document.createElement("div");
  info.innerHTML = `
    <div>
      <strong>${transaction.date}</strong> •
      <span class="${transaction.type}">
        ${TYPE_LABELS[transaction.type] || transaction.type}
      </span>
    </div>
    <div class="note">${transaction.note ? escapeHtml(transaction.note) : ""}</div>
  `;

  const amount = document.createElement("div");
  amount.className = `amount ${transaction.type}`;
  amount.textContent =
    (transaction.type === TRANSACTION_TYPES.EXPENSE ? "− " : "+ ") +
    formatMoney(transaction.amount, currency);

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove";
  removeBtn.type = "button";
  removeBtn.title = "Удалить";
  removeBtn.textContent = "×";
  removeBtn.dataset.action = "remove";

  li.append(badge, info, amount, removeBtn);
  return li;
}

export function renderList(
  { listEl, emptyEl, pagerEl, pagerInfoEl, loadMoreBtn },
  { transactionsAll, visible, paging, editingId },
  currency = DEFAULT_CURRENCY,
) {
  listEl.innerHTML = "";
  hidePager({ pagerEl, pagerInfoEl, loadMoreBtn });

  if (transactionsAll.length === 0) {
    renderEmptyState(
      { emptyEl },
      "Операций пока нет. Добавь первую 👇",
    );
    return;
  }

  if (visible.length === 0) {
    renderEmptyState({ emptyEl }, "Ничего не найдено по фильтрам 🙃");
    return;
  }

  emptyEl.style.display = "none";

  const total = visible.length;
  const shown = Math.min(paging.limit, total);

  for (const transaction of visible.slice(0, shown)) {
    listEl.append(
      createTransactionItem(transaction, { currency, editingId }),
    );
  }

  pagerEl.style.display = total > 0 ? "flex" : "none";
  pagerInfoEl.textContent = `Показано ${shown} из ${total}`;
  loadMoreBtn.style.display = shown < total ? "inline-flex" : "none";
}
