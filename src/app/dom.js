function must(el, name) {
  if (!el) throw new Error(`DOM not found: ${name}`);
  return el;
}

export const dom = {
  // form + modal
  form: must(document.querySelector("#transactionForm"), "#transactionForm"),
  modalEl: must(document.querySelector("#txModal"), "#txModal"),
  closeModalBtn: document.querySelector("#closeModalBtn"),
  modalTitleEl: must(document.querySelector("#modalTitle"), "#modalTitle"),
  openCreateBtn: document.querySelector("#openCreateBtn"),

  // list
  listEl: must(document.querySelector("#transactionsList"), "#transactionsList"),
  emptyEl: must(document.querySelector("#emptyState"), "#emptyState"),

  // form error
  errorEl: must(document.querySelector("#formError"), "#formError"),

  // totals
  incomeEl: must(document.querySelector("#incomeTotal"), "#incomeTotal"),
  expenseEl: must(document.querySelector("#expenseTotal"), "#expenseTotal"),
  balanceEl: must(document.querySelector("#balanceTotal"), "#balanceTotal"),

  // buttons
  submitBtn: must(document.querySelector("#submitBtn"), "#submitBtn"),
  cancelEditBtn: document.querySelector("#cancelEditBtn"),
  clearAllBtn: document.querySelector("#clearAllBtn"),
  exportCsvBtn: document.querySelector("#exportCsvBtn"),
  themeToggleBtn: document.querySelector("#themeToggleBtn"),
  currencySelectEl: document.querySelector("#currencySelect"),
  

  // filters
  filtersToggleBtn: document.getElementById("filtersToggleBtn"),
  filtersCollapseEl: document.getElementById("filtersCollapse"),
  filterTypeEl: document.querySelector("#filterType"),
  filterCategoryEl: document.querySelector("#filterCategory"),
  filterQueryEl: document.querySelector("#filterQuery"),
  resetFiltersBtn: document.querySelector("#resetFiltersBtn"),
  sortOrderEl: document.querySelector("#sortOrder"),
  filterPeriodEl: document.querySelector("#filterPeriod"),
  filterFromEl: document.querySelector("#filterFrom"),
  filterToEl: document.querySelector("#filterTo"),

  // stats
  statsExpenseEl: must(document.querySelector("#statsExpense"), "#statsExpense"),
  statsIncomeEl: must(document.querySelector("#statsIncome"), "#statsIncome"),
  statsExpenseEmptyEl: must(document.querySelector("#statsExpenseEmpty"), "#statsExpenseEmpty"),
  statsIncomeEmptyEl: must(document.querySelector("#statsIncomeEmpty"), "#statsIncomeEmpty"),

  // pager
  pagerEl: must(document.querySelector("#listPager"), "#listPager"),
  pagerInfoEl: must(document.querySelector("#pagerInfo"), "#pagerInfo"),
  loadMoreBtn: document.querySelector("#loadMoreBtn"),

  // toasts
  toastsEl: must(document.querySelector("#toasts"), "#toasts"),

  chartExpense: must(document.querySelector("#chartExpense"), "#chartExpense"),
  chartIncome: must(document.querySelector("#chartIncome"), "#chartIncome"),
};