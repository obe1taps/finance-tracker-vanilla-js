import { dom } from "./dom.js";
import {
  readForm,
  validateForm,
  resetFormToDefault,
} from "../controllers/formController.js";
import { handleListClick } from "../controllers/listController.js";
import { state } from "../core/state.js";
import {
  addTransaction,
  updateTransaction,
  deleteTransactionWithUndo,
  undoLastDelete,
  clearAllWithUndo,
  undoClearAll,
  resetPaging,
} from "../core/actions.js";
import {
  loadTransactions,
  loadCurrency,
  saveCurrency,
  loadThemeMode,
  saveThemeMode,
  loadFiltersOpen,
  saveFiltersOpen,
} from "../utils/storage.js";
import { formatMoney, todayISO, escapeHtml } from "../utils/utils.js";
import { applyFilters, resetFilters } from "../domain/filters.js";
import { applyFiltersToDom, syncPeriodUI } from "../ui/filtersUi.js";
import {
  syncCategoryOptionsByType,
  syncFilterCategoryOptions,
} from "../ui/categoryOptions.js";
import { exportTransactionsToCSV } from "../domain/export.js";
import { renderList, renderTotals, renderStats } from "../ui/ui.js";
import { createToast } from "../ui/toast.js";
import { createModal } from "../ui/modal.js";
import { applyTheme, toggleTheme, bindAutoThemeListener } from "../ui/theme.js";
import { renderCategoryCharts } from "../ui/charts.js";
import { attachDonutTooltip } from "../ui/donutTooltip.js";
import { initFiltersAccordion } from "../ui/filtersAccordion.js";
import { bindEvents } from "./bindEvents.js";

// DOM refs
const form = dom.form;

// modal + toast
const modal = createModal({ modalEl: dom.modalEl, form });
const { showToast } = createToast({ toastsEl: dom.toastsEl, escapeHtml });

// Init state
state.transactions = loadTransactions();
state.currency = loadCurrency();
if (dom.currencySelectEl) dom.currencySelectEl.value = state.currency;

// Edit
function startEdit(tx) {
  state.editingId = tx.id;

  form.elements.type.value = tx.type;
  form.elements.amount.value = tx.amount;
  form.elements.category.value = tx.category;
  form.elements.date.value = tx.date;
  form.elements.note.value = tx.note || "";

  dom.modalTitleEl.textContent = "Редактирование операции";
  dom.submitBtn.textContent = "Сохранить";
  dom.cancelEditBtn.textContent = "Закрыть";

  syncCategoryOptionsByType(form, tx.type);
}

function stopEdit() {
  state.editingId = null;
  form.reset();
  form.elements.date.value = todayISO();

  dom.modalTitleEl.textContent = "Новая операция";
  dom.submitBtn.textContent = "Добавить";
  dom.cancelEditBtn.textContent = "Закрыть";
}

function closeModalAndReset() {
  modal.close({
    onClose: () => {
      showError("");
      stopEdit();
      rerender();
    },
  });
}

// Helpers
function showError(message) {
  dom.errorEl.textContent = message || "";
}

let lastVisible = [];
let lastColorMaps = null;

function rafThrottle(fn) {
  let scheduled = false;
  return () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      fn();
    });
  };
}

// Render
function rerender() {
  const visible = applyFilters(state.transactions, state.filters);
  lastVisible = visible;

  renderList(
    {
      listEl: dom.listEl,
      emptyEl: dom.emptyEl,
      pagerEl: dom.pagerEl,
      pagerInfoEl: dom.pagerInfoEl,
      loadMoreBtn: dom.loadMoreBtn,
    },
    {
      transactionsAll: state.transactions,
      visible,
      paging: state.paging,
      editingId: state.editingId,
    },
    state.currency,
  );

  renderTotals(
    {
      incomeEl: dom.incomeEl,
      expenseEl: dom.expenseEl,
      balanceEl: dom.balanceEl,
    },
    state.transactions,
    state.currency,
  );

  lastColorMaps =
    renderCategoryCharts(
      { chartExpense: dom.chartExpense, chartIncome: dom.chartIncome },
      visible,
      { currency: state.currency },
    ) || null;

  renderStats(
    {
      statsExpenseEl: dom.statsExpenseEl,
      statsIncomeEl: dom.statsIncomeEl,
      statsExpenseEmptyEl: dom.statsExpenseEmptyEl,
      statsIncomeEmptyEl: dom.statsIncomeEmptyEl,
    },
    visible,
    lastColorMaps || {},
    state.currency,
  );
}

function resetPagingAndRender(limit = 10) {
  resetPaging(state, limit);
  rerender();
}

// Init
applyTheme(loadThemeMode(), { themeToggleBtn: dom.themeToggleBtn });
bindAutoThemeListener({
  loadThemeMode,
  themeToggleBtn: dom.themeToggleBtn,
});

const filtersAccordion = initFiltersAccordion({
  wrapEl: dom.filtersCollapseEl,
  toggleBtn: dom.filtersToggleBtn,
  loadFiltersOpen,
  saveFiltersOpen,
});

const redrawChartsOnly = rafThrottle(() => {
  if (!lastVisible) return;

  renderCategoryCharts(
    { chartExpense: dom.chartExpense, chartIncome: dom.chartIncome },
    lastVisible,
    { currency: state.currency, formatMoney },
  );
});

const ro = new ResizeObserver(() => {
  redrawChartsOnly();
});

if (dom.chartExpense) ro.observe(dom.chartExpense);
if (dom.chartIncome) ro.observe(dom.chartIncome);

attachDonutTooltip({
  canvas: dom.chartExpense,
  getCurrency: () => state.currency,
  formatMoney,
  escapeHtml,
});

attachDonutTooltip({
  canvas: dom.chartIncome,
  getCurrency: () => state.currency,
  formatMoney,
  escapeHtml,
});

form.elements.date.value = todayISO();
applyFiltersToDom(dom, state.filters);
const nextCat = syncFilterCategoryOptions(dom.filterTypeEl, dom.filterCategoryEl);
if (nextCat) state.filters.category = nextCat;
syncPeriodUI(dom, state.filters);
rerender();

bindEvents({
  dom,
  state,
  form,
  modal,
  showToast,
  rerender,
  resetPagingAndRender,
  closeModalAndReset,

  // actions
  addTransaction,
  updateTransaction,
  deleteTransactionWithUndo,
  undoLastDelete,
  clearAllWithUndo,
  undoClearAll,

  // controllers
  readForm,
  validateForm,
  resetFormToDefault,
  handleListClick,

  // app helpers
  formatMoney,
  todayISO,

  // filters ui
  syncPeriodUI,
  applyFiltersToDom,
  syncFilterCategoryOptions,
  resetFiltersFn: resetFilters,

  // category options
  syncCategoryOptionsByType,

  // edit flow
  startEdit,
  stopEdit,

  // theme
  toggleTheme,
  saveThemeMode,

  // currency
  saveCurrency,

  // export
  exportTransactionsToCSV,

  // accordion
  filtersAccordion,
});
