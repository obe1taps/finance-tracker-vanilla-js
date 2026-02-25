export function bindEvents({
  // edit flow
  startEdit,
  stopEdit,

  // form categories
  syncCategoryOptionsByType,

  // domain
  resetFiltersFn,

  // core
  dom,
  state,
  form,
  modal,

  // ui callbacks
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

  // helpers
  formatMoney,
  todayISO,

  // filters ui
  syncPeriodUI,
  applyFiltersToDom,
  syncFilterCategoryOptions,

  // theme
  toggleTheme,
  saveThemeMode,

  // currency
  saveCurrency,

  // export
  exportTransactionsToCSV,

  // accordion
  filtersAccordion,
} = {}) {
  const cleanups = [];

  const showError = (message) => {
    if (dom?.errorEl) dom.errorEl.textContent = message || "";
  };

  // Currency
  if (dom?.currencySelectEl) {
    const onCurrencyChange = (e) => {
      const next = e.target.value;
      if (next !== "RUB" && next !== "USD" && next !== "BYN") return;

      state.currency = next;
      if (typeof saveCurrency === "function") saveCurrency(next);
      rerender();
    };

    dom.currencySelectEl.addEventListener("change", onCurrencyChange);
    cleanups.push(() =>
      dom.currencySelectEl.removeEventListener("change", onCurrencyChange),
    );
  }

  // Theme
  if (dom?.themeToggleBtn) {
    const onThemeClick = () => {
      if (typeof toggleTheme === "function") {
        toggleTheme({
          saveThemeMode,
          themeToggleBtn: dom.themeToggleBtn,
        });
      }
      rerender();
    };

    dom.themeToggleBtn.addEventListener("click", onThemeClick);
    cleanups.push(() => dom.themeToggleBtn.removeEventListener("click", onThemeClick));
  }

  // Form submit
  if (form) {
    const onSubmit = (e) => {
      e.preventDefault();
      showError("");

      const wasEditing = Boolean(state.editingId);
      const data = readForm(form);
      const err = validateForm(data);
      if (err) return showError(err);

      if (state.editingId) {
        updateTransaction(state, state.editingId, { ...data, amount: data.amount });
      } else {
        addTransaction(state, data);
        resetFormToDefault(form);
      }

      showToast({
        title: wasEditing ? "Изменения сохранены" : "Операция добавлена",
        type: "success",
      });

      resetPagingAndRender();
      closeModalAndReset();
    };

    form.addEventListener("submit", onSubmit);
    cleanups.push(() => form.removeEventListener("submit", onSubmit));
  }

  // Form type change
  if (form?.elements?.type && typeof syncCategoryOptionsByType === "function") {
    const onType = (e) => syncCategoryOptionsByType(form, e.target.value);

    form.elements.type.addEventListener("change", onType);
    cleanups.push(() => form.elements.type.removeEventListener("change", onType));
  }

  // List click (edit/remove)
  if (dom?.listEl) {
    const onListClick = (e) => {
      handleListClick({
        e,
        state,
        modal,
        formatRub: (v) => formatMoney(v, state.currency),
        showToast,
        rerender,
        startEdit,
        deleteTransactionWithUndo,
        undoLastDelete,
      });
    };

    dom.listEl.addEventListener("click", onListClick);
    cleanups.push(() => dom.listEl.removeEventListener("click", onListClick));
  }

  // Clear all
  if (dom?.clearAllBtn) {
    const onClearAll = () => {
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
    };

    dom.clearAllBtn.addEventListener("click", onClearAll);
    cleanups.push(() => dom.clearAllBtn.removeEventListener("click", onClearAll));
  }

  // Filters: type
  if (dom?.filterTypeEl) {
    const onFilterType = (e) => {
      state.filters.type = e.target.value;

      const nextCat = syncFilterCategoryOptions(dom.filterTypeEl, dom.filterCategoryEl);
      if (nextCat) state.filters.category = nextCat;

      resetPagingAndRender();
    };

    dom.filterTypeEl.addEventListener("change", onFilterType);
    cleanups.push(() => dom.filterTypeEl.removeEventListener("change", onFilterType));
  }

  // Filters: category
  if (dom?.filterCategoryEl) {
    const onFilterCategory = (e) => {
      state.filters.category = e.target.value;
      resetPagingAndRender();
    };

    dom.filterCategoryEl.addEventListener("change", onFilterCategory);
    cleanups.push(() =>
      dom.filterCategoryEl.removeEventListener("change", onFilterCategory),
    );
  }

  // Filters: query
  if (dom?.filterQueryEl) {
    const onQuery = (e) => {
      state.filters.query = e.target.value;
      resetPagingAndRender();
    };

    dom.filterQueryEl.addEventListener("input", onQuery);
    cleanups.push(() => dom.filterQueryEl.removeEventListener("input", onQuery));
  }

  // Filters: period
  if (dom?.filterPeriodEl) {
    const onPeriod = (e) => {
      state.filters.period = e.target.value;

      if (state.filters.period === "custom") {
        if (!state.filters.from) state.filters.from = todayISO();
        if (!state.filters.to) state.filters.to = todayISO();
      }

      syncPeriodUI(dom, state.filters);
      resetPagingAndRender();
    };

    dom.filterPeriodEl.addEventListener("change", onPeriod);
    cleanups.push(() => dom.filterPeriodEl.removeEventListener("change", onPeriod));
  }

  // Filters: from/to
  if (dom?.filterFromEl) {
    const onFrom = (e) => {
      state.filters.period = "custom";
      state.filters.from = e.target.value;
      syncPeriodUI(dom, state.filters);
      resetPagingAndRender();
    };

    dom.filterFromEl.addEventListener("change", onFrom);
    cleanups.push(() => dom.filterFromEl.removeEventListener("change", onFrom));
  }

  if (dom?.filterToEl) {
    const onTo = (e) => {
      state.filters.period = "custom";
      state.filters.to = e.target.value;
      syncPeriodUI(dom, state.filters);
      resetPagingAndRender();
    };

    dom.filterToEl.addEventListener("change", onTo);
    cleanups.push(() => dom.filterToEl.removeEventListener("change", onTo));
  }

  // Filters: reset
  if (dom?.resetFiltersBtn) {
    const onReset = () => {
      if (typeof resetFiltersFn === "function") {
        state.filters = resetFiltersFn(state.filters);
      }

      applyFiltersToDom(dom, state.filters);

      showToast({ title: "Фильтры сброшены", type: "info" });

      const nextCat = syncFilterCategoryOptions(dom.filterTypeEl, dom.filterCategoryEl);
      if (nextCat) state.filters.category = nextCat;

      resetPagingAndRender();
    };

    dom.resetFiltersBtn.addEventListener("click", onReset);
    cleanups.push(() => dom.resetFiltersBtn.removeEventListener("click", onReset));
  }

  // Filters: sort
  if (dom?.sortOrderEl) {
    const onSort = (e) => {
      state.filters.sort = e.target.value;
      resetPagingAndRender();
    };

    dom.sortOrderEl.addEventListener("change", onSort);
    cleanups.push(() => dom.sortOrderEl.removeEventListener("change", onSort));
  }

  // Open create modal
  if (dom?.openCreateBtn && typeof stopEdit === "function" && form) {
    const onOpenCreate = () => {
      stopEdit();

      dom.modalTitleEl.textContent = "Новая операция";
      dom.submitBtn.textContent = "Добавить";
      dom.cancelEditBtn.textContent = "Закрыть";

      form.reset();
      form.elements.type.value = "expense";
      if (typeof syncCategoryOptionsByType === "function") {
        syncCategoryOptionsByType(form, "expense");
      }
      form.elements.date.value = todayISO();

      modal.open();
    };

    dom.openCreateBtn.addEventListener("click", onOpenCreate);
    cleanups.push(() => dom.openCreateBtn.removeEventListener("click", onOpenCreate));
  }

  // Close modal
  if (dom?.closeModalBtn) {
    const onCloseBtn = () => closeModalAndReset();
    dom.closeModalBtn.addEventListener("click", onCloseBtn);
    cleanups.push(() => dom.closeModalBtn.removeEventListener("click", onCloseBtn));
  }

  if (dom?.modalEl) {
    const onOverlayClick = (e) => {
      if (e.target?.dataset?.close === "true") closeModalAndReset();
    };
    dom.modalEl.addEventListener("click", onOverlayClick);
    cleanups.push(() => dom.modalEl.removeEventListener("click", onOverlayClick));
  }

  if (dom?.cancelEditBtn) {
    const onCancel = () => closeModalAndReset();
    dom.cancelEditBtn.addEventListener("click", onCancel);
    cleanups.push(() => dom.cancelEditBtn.removeEventListener("click", onCancel));
  }

  // Escape key
  const onKeyDown = (e) => {
    if (e.key !== "Escape") return;

    if (modal.isOpen()) {
      closeModalAndReset();
      return;
    }

    if (filtersAccordion?.isOpen?.()) {
      filtersAccordion.setOpen(false, { focusFirst: false });
    }
  };

  document.addEventListener("keydown", onKeyDown);
  cleanups.push(() => document.removeEventListener("keydown", onKeyDown));

  // Export CSV
  if (dom?.exportCsvBtn) {
    const onExport = () => {
      if (state.transactions.length === 0) {
        showToast({ title: "Нет данных для экспорта", type: "info" });
        return;
      }

      exportTransactionsToCSV(state.transactions);
      showToast({ title: "CSV файл скачан", type: "success" });
    };

    dom.exportCsvBtn.addEventListener("click", onExport);
    cleanups.push(() => dom.exportCsvBtn.removeEventListener("click", onExport));
  }

  // Load more
  if (dom?.loadMoreBtn) {
    const onMore = () => {
      const step = state.paging.step ?? 10;
      state.paging.limit += step;
      rerender();
    };

    dom.loadMoreBtn.addEventListener("click", onMore);
    cleanups.push(() => dom.loadMoreBtn.removeEventListener("click", onMore));
  }

  return {
    destroy() {
      for (const fn of cleanups) fn();
    },
  };
}