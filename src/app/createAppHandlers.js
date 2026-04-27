import {
  CURRENCIES,
  DEFAULT_PAGING,
  TRANSACTION_TYPES,
} from "../config/appConfig.js";

export function createAppHandlers({
  dom,
  state,
  form,
  modal,

  showToast,
  rerender,
  resetPagingAndRender,
  closeModalAndReset,

  addTransaction,
  updateTransaction,
  deleteTransactionWithUndo,
  undoLastDelete,
  clearAllWithUndo,
  undoClearAll,

  readForm,
  validateForm,
  resetFormToDefault,
  handleListClick,

  formatMoney,
  todayISO,

  syncPeriodUI,
  applyFiltersToDom,
  syncFilterCategoryOptions,
  resetFiltersFn,

  syncCategoryOptionsByType,

  startEdit,
  stopEdit,

  toggleTheme,
  saveThemeMode,

  saveCurrency,
  saveMonthlyBudget,
  parseMoneyInput,

  exportTransactionsToCSV,

  filtersAccordion,
}) {
  const showError = (message) => {
    if (dom?.errorEl) dom.errorEl.textContent = message || "";
  };

  return {
    onCurrencyChange(e) {
      const next = e.target.value;
      if (!CURRENCIES.includes(next)) return;

      state.currency = next;
      if (typeof saveCurrency === "function") saveCurrency(next);
      rerender();
    },

    onMonthlyBudgetInput(e) {
      const raw = e.target.value;
      const budget = typeof parseMoneyInput === "function"
        ? parseMoneyInput(raw)
        : Number(raw);

      state.monthlyBudget = Number.isFinite(budget) && budget > 0 ? budget : 0;
      if (typeof saveMonthlyBudget === "function") {
        saveMonthlyBudget(state.monthlyBudget);
      }

      rerender();
    },

    onThemeClick() {
      if (typeof toggleTheme === "function") {
        toggleTheme({
          saveThemeMode,
          themeToggleBtn: dom.themeToggleBtn,
        });
      }
    },

    onSubmit(e) {
      e.preventDefault();
      showError("");

      const wasEditing = Boolean(state.editingId);
      const data = readForm(form);
      const err = validateForm(data);

      if (err) {
        showError(err);
        return;
      }

      if (state.editingId) {
        updateTransaction(state, state.editingId, data);
      } else {
        addTransaction(state, data);
        resetFormToDefault(form);
      }

      showToast({
        title: wasEditing ? "Изменения сохранены" : "Операция добавлена",
        type: "success",
      });

      resetPagingAndRender();
      modal.close();
      showError("");
      stopEdit();
    },

    onFormTypeChange(e) {
      syncCategoryOptionsByType(form, e.target.value);
    },

    onFormClick(e) {
      const quickAmountBtn = e.target.closest("[data-quick-amount]");
      if (!quickAmountBtn) return;

      const value = quickAmountBtn.dataset.quickAmount;
      if (!value) return;

      form.elements.amount.value = value;
      form.elements.amount.focus();
    },

    onListClick(e) {
      handleListClick({
        e,
        state,
        modal,
        formatRub: (value) => formatMoney(value, state.currency),
        showToast,
        rerender,
        startEdit,
        deleteTransactionWithUndo,
        undoLastDelete,
      });
    },

    onClearAll() {
      if (state.transactions.length === 0) {
        showToast({ title: "Нет операций для удаления", type: "info" });
        return;
      }

      const ok = confirm("Точно очистить все операции? Это действие нельзя отменить.");
      if (!ok) return;

      const res = clearAllWithUndo(state);
      if (!res) return;

      rerender();

      showToast({
        title: "Все операции удалены",
        text: `Удалено: ${res.count}`,
        type: "danger",
        ms: res.ms,
        actionText: "Отменить",
        onAction: () => {
          if (!undoClearAll(state)) return;
          rerender();
          showToast({ title: "Очистка отменена", type: "success" });
        },
      });
    },

    onFilterTypeChange(e) {
      state.filters.type = e.target.value;

      const nextCat = syncFilterCategoryOptions(
        dom.filterTypeEl,
        dom.filterCategoryEl,
      );

      if (nextCat) state.filters.category = nextCat;

      resetPagingAndRender();
    },

    onFilterCategoryChange(e) {
      state.filters.category = e.target.value;
      resetPagingAndRender();
    },

    onFilterQueryInput(e) {
      state.filters.query = e.target.value;
      resetPagingAndRender();
    },

    onFilterPeriodChange(e) {
      state.filters.period = e.target.value;

      if (state.filters.period === "custom") {
        if (!state.filters.from) state.filters.from = todayISO();
        if (!state.filters.to) state.filters.to = todayISO();
      }

      syncPeriodUI(dom, state.filters);
      resetPagingAndRender();
    },

    onFilterFromChange(e) {
      state.filters.period = "custom";
      state.filters.from = e.target.value;
      syncPeriodUI(dom, state.filters);
      resetPagingAndRender();
    },

    onFilterToChange(e) {
      state.filters.period = "custom";
      state.filters.to = e.target.value;
      syncPeriodUI(dom, state.filters);
      resetPagingAndRender();
    },

    onResetFilters() {
      if (typeof resetFiltersFn === "function") {
        state.filters = resetFiltersFn(state.filters);
      }

      applyFiltersToDom(dom, state.filters);

      const nextCat = syncFilterCategoryOptions(
        dom.filterTypeEl,
        dom.filterCategoryEl,
      );

      if (nextCat) state.filters.category = nextCat;

      showToast({ title: "Фильтры сброшены", type: "info" });
      resetPagingAndRender();
    },

    onSortChange(e) {
      state.filters.sort = e.target.value;
      resetPagingAndRender();
    },

    onOpenCreate() {
      stopEdit();

      dom.modalTitleEl.textContent = "Новая операция";
      dom.submitBtn.textContent = "Добавить";
      dom.cancelEditBtn.textContent = "Закрыть";

      form.reset();
      form.elements.type.value = TRANSACTION_TYPES.EXPENSE;
      syncCategoryOptionsByType(form, TRANSACTION_TYPES.EXPENSE);
      form.elements.date.value = todayISO();

      modal.open();
    },

    onCloseModal() {
      closeModalAndReset();
    },

    onCancelEdit() {
      closeModalAndReset();
    },

    onModalOverlayClick(e) {
      if (e.target?.dataset?.close === "true") {
        closeModalAndReset();
      }
    },

    onKeyDown(e) {
      if (e.key !== "Escape") return;

      if (modal.isOpen()) {
        closeModalAndReset();
        return;
      }

      if (filtersAccordion?.isOpen?.()) {
        filtersAccordion.setOpen(false, { focusFirst: false });
      }
    },

    onExportCsv() {
      if (state.transactions.length === 0) {
        showToast({ title: "Нет данных для экспорта", type: "info" });
        return;
      }

      exportTransactionsToCSV(state.transactions);
      showToast({ title: "CSV файл скачан", type: "success" });
    },

    onLoadMore() {
      const step = state.paging.step ?? DEFAULT_PAGING.step;
      state.paging.limit += step;
      rerender();
    },
  };
}
